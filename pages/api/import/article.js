/* FIXME 🚨This code is especially terrible and needs refactoring 🚨*/
const sbdTokenizer = require('sbd')
const SentimentIntensityAnalyzer = require('vader-sentiment').SentimentIntensityAnalyzer
const stopwords = require('stopwords-en')
const { findTitles } = require('entity-finder')
const nlp = require('compromise')

const { send, queryParser } = require('lib/request-handler')
const { parseHtmlFromUrl } = require('lib/parse-html')
const { getQuotes } = require('lib/quotes')
const { importArticle } = require('lib/db/import')

// Set to true to disable functionality that requires network access (eg for debugging)
// @FIXME Push WikiData and Topic resolution to dedicated endpoints to avoid blocking,
// otherwise request completion times can be excessive.
const OFFLINE_MODE = true

module.exports = async (req, res, callback) => {
  res.callbackWaitsForEmptyEventLoop = false;

  const { url } = queryParser(req)

  if (!url)
    return send(res, 400, { error: 'URL parameter missing' })

  let { structuredData, text } = req.locals ? req.locals : await parseHtmlFromUrl(url)

  // Add a full stop after the end of every line, if there is not one already
  text = text.replace(/([^\.])\n/g, "$1.\n")

  const quotes = getQuotes(text)
  let quotesWithNumbers = []
  quotes.forEach(quote => {
    if (quote.match(/[0-9]/))
      quotesWithNumbers.push(quote)
  })

  // Get sentences in text
  const sentences = sbdTokenizer.sentences(text, { newline_boundaries: true, html_boundaries: true })
  
  // Build word list
  let words = `${structuredData.title} ${structuredData.description} ${structuredData.tags} ${text}`.split(' ')

  let keywords = []
  getKeywords(words.join(' ')).forEach(word => { 
    keywords.push({
      name: word,
      count: 0
    })
  })

  // Build topic list
  let topics = []
  nlp(words).topics().out('freq').map(async(topic) => {
    // Only include topics with more than one mention
    if (topic.count > 1) {
      let name = topic.normal

      // Ignore strings like 'Ms Smith' or 'Mr Smith' as these
      // tends to create false positives (and the full name of
      // the person is typically referenced at least once too)
      if (name.split(' ').length == 2 && name.match(/^(mr|ms|mrs|dr) /i))
        return

      const matches = words.join(' ').match(new RegExp(name.replace(/[^A-z0-9\-' ]/, ''), 'img'))
      if (matches && matches[0]) {
        name = matches[0]
      }

      topics.push({
        name: name,
        count: topic.count
      })
    }
  })

  if (structuredData.tags) {
    structuredData.tags.map(async tag => {
      topics.push({
        name: tag
      })
    })
  }

  let topicsWithDetail = []
  await Promise.all(
    topics.map(async topic => {
      return await new Promise(async (resolve) => {
        const relatedTopics = await getRelatedTopics(topic.name)

        if (relatedTopics.default && relatedTopics.default.rankedList[0].rankedKeyword[0]) {
          const googleTopic = relatedTopics.default.rankedList[0].rankedKeyword[0].topic
          const wikipediaData = await getWikipediaEntities([googleTopic.title])

          let name = googleTopic.title
          let count = topic.count
          let description = (wikipediaData[0]) ? wikipediaData[0].description : googleTopic.type
          let topicUrl = (wikipediaData[0]) ? wikipediaData[0].url : null
          
          topicsWithDetail.push({
            name,
            description,
            url: topicUrl,
            count
          })
        } else {
          const wikipediaData = await getWikipediaEntities([topic.name])

          let name = topic.name
          let count = topic.count
          let description = (wikipediaData[0]) ? wikipediaData[0].description : null
          let topicUrl = (wikipediaData[0]) ? wikipediaData[0].url : null

          const matches = words.join(' ').match(new RegExp(name.replace(/[^A-z0-9\-' ]/, ''), 'img'))
          if (matches && matches[0]) {
            name = matches[0]
          }

          topicsWithDetail.push({
            name,
            description,
            url: topicUrl,
            count
          })
        }
        return resolve()
      })
    })
  )
  topics = topicsWithDetail

  // Deduplicate and filter topics
  let filteredTopics = {}
  topics.map(topic => {
    // If no URL, push from topic into keyword
    if (topic.url === null) {

      let alreadyInKeywords = false
      keywords.forEach((keyword, i) => {
        if (keyword.name.toLowerCase() === topic.name.toLowerCase()) {
          alreadyInKeywords = true

          if (!keyword.count && topic.count)
            keywords[i].count = topic.count

          if (keyword.name === topic.name.toLowerCase())
            keywords[i].name = topic.name
        }
      })

      if (alreadyInKeywords !== true)
        keywords.push(topic)
        
      return
    }

    if (!filteredTopics[topic.url]) {
      filteredTopics[topic.url] = topic
    } else {
      filteredTopics[topic.url].count = topic.count
    }
  })
  topics = Object.keys(filteredTopics).map(topic => { return filteredTopics[topic] })  

  sentences.forEach(sentence => {
    keywords.forEach(keyword => {
      
      if (sentence.toLowerCase().includes(keyword.name.toLowerCase())) {
        keyword.count++

        const sentenceSentiment = SentimentIntensityAnalyzer.polarity_scores(sentence)

        if (!keyword.sentiment) {
          keyword.sentiment = {
            positiveCount: 0,
            negativeCount: 0,
            neutralCount: 0
          }
        }

        if (!keyword.sentiment) {
          keyword.sentiment = sentenceSentiment.compound
        } else {
          if (sentenceSentiment.pos > sentenceSentiment.neg) {
            keyword.sentiment.positiveCount++
          } else if (sentenceSentiment.neg > sentenceSentiment.pos && sentenceSentiment.neg > sentenceSentiment.neu) {
            keyword.sentiment.negativeCount++
          } else {
            keyword.sentiment.neutralCount++
          }
        }
      
      }
    })
  })

  // Sort topics by total count
  topics.sort((a, b) => { return b.count - a.count })
  keywords.sort((a, b) => { return b.count - a.count })

  let sentencesWithNumbers = []
  sentences.forEach(sentence => {
    if (sentence.match(/[0-9]/))
      sentencesWithNumbers.push(sentence.replace(/\n/g, ' '))
  })

  const articleHeadlineSentiment = SentimentIntensityAnalyzer.polarity_scores(structuredData.title)
  const articleTextSentiment = SentimentIntensityAnalyzer.polarity_scores(text)
  const articleOverallSentiment = SentimentIntensityAnalyzer.polarity_scores(`${structuredData.title} ${structuredData.description} ${text}`)

  let articleSentencesWithSentiment = []
  sentences.forEach(sentence => {
    articleSentencesWithSentiment.push({
      length: sentence.replace(/\n/g, ' ').length,
      ...SentimentIntensityAnalyzer.polarity_scores(sentence.replace(/\n/g, ' '))
    })
  })

  const sentiment = {
    headline: articleHeadlineSentiment,
    text: articleTextSentiment,
    overall: articleOverallSentiment
  }

  const wordCount = text.split(' ').length;

  // We don't need structured data text property, as full text extraction is much more sophisticated
  if (structuredData.text) delete structuredData.text

  // Construct article to return
  const article = {
    url,
    sentences: articleSentencesWithSentiment,
    //sentencesWithNumbers,
    quotes,
    //quotesWithNumbers,
    sentiment,
    wordCount,
    structuredData,
    keywords,
    topics,  
    text: text.trim()
  }

  await importArticle(article)

  if (req.locals && req.locals.useStreamingResponseHandler) {
    Promise.resolve(article)
  } else {
    send(res, 200, article)
  }

  // Trigger AWS Lambda to be frozen
  if (callback) return callback(null, article)
}

function getKeywords(text) {
  const consecutiveCapitalizedWordsRegexp = /([A-Z][a-zA-Z0-9-]*)([\s][A-Z][a-zA-Z0-9-]*)+/gm
  const consecutiveCapitalizedWords = text.match(consecutiveCapitalizedWordsRegexp)
  const capitalizedWordsRegexp = /([A-Z][a-zA-Z0-9-]*)/gm
  const capitalizedWords = text.match(capitalizedWordsRegexp)

  // Start with all the consecutive capitalized words as possible entities
  let keywords = consecutiveCapitalizedWords || []

  // Next, add all the individually capitalized words
  if (capitalizedWords) {
    capitalizedWords.forEach(word => {
      keywords.push(word)
    })
  }

  // Strip the prefix / suffix "The" if font on keywords, to improve quality of results
  keywords.forEach((word, index) => {
    if (word.startsWith("The "))
      keywords[index] = word.replace(/^The /, '')
    if (word.endsWith(" The"))
      keywords[index] = word.replace(/ The$/, '')
  })

  // Remove duplicates
  keywords = cleanWords(keywords)

  return keywords
}

function cleanWords(array) {
  let arrayWithoutDuplicates = []
  array.forEach(item => {
    // Check if we have added this item already and length is > 3
    if (!arrayWithoutDuplicates.includes(item) && item.length > 3)
      arrayWithoutDuplicates.push(item)
  })

  // If the item is part of any other (larger) item, don't include it,
  // only include the more specific item.
  // e.g. 'Theresa May' is part of 'Prime Minister Theresa May'
  let arrayWithOnlyMostSpecificItems = []
  arrayWithoutDuplicates.forEach(item => {
    let addItem = true
    arrayWithoutDuplicates.forEach((possibleDuplicateItem) => {
      if (item !== possibleDuplicateItem && possibleDuplicateItem.includes(item)) {
        addItem = false
      } else {
      }
    })

    if (addItem === true)
      arrayWithOnlyMostSpecificItems.push(item)
  })

  let arrayWithoutStopWords = []
  arrayWithOnlyMostSpecificItems.forEach(item => {
    if (!stopwords.includes(item.toLowerCase()))
      arrayWithoutStopWords.push(item)
  })

  return arrayWithoutStopWords
}

async function getRelatedTopics(keywords) {
  if (OFFLINE_MODE) return Promise.resolve({})

  try {
    const json = await googleTrendsApi.relatedTopics({
      keyword: keywords,
      category: 16 // News
    })
    return Promise.resolve(JSON.parse(json))
  } catch (e) {
    return Promise.resolve({})
  }
}

async function getWikipediaEntities(concepts) {
  if (OFFLINE_MODE) return Promise.resolve({})

  const wikipediaData = await Promise.all(
    // Limit to 100 tags
    concepts.slice(0,100).map(concept => {
      return findTitles(concept, 'en', { limit: 1 })
    })
  )

  let entities = []
  wikipediaData.forEach(entity => {
    if (entity[0] && entity[0].title.length > 3)
      entities.push({
        name: (entity[0].simple) ? entity[0].simple : entity[0].title,
        description: entity[0].description,
        url: `http://en.wikipedia.org/wiki/${entity[0].title.replace(/ /g, '_')}`
      })
  })

  return entities
}