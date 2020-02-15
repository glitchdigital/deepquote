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

  let { metadata, structuredData, text: rawText, html } = req.locals ? req.locals : await parseHtmlFromUrl(url)

  // Add a full stop after the end of every line, if there is not one already
  const text = rawText.replace(/([^\.])\n/g, "$1.\n")

  const quotes = getQuotes(text)

  // Get sentences in text
  const sentences = sbdTokenizer.sentences(text, { newline_boundaries: true, html_boundaries: true })
  
  // Build word list
  let words = `${structuredData.title} ${structuredData.description} ${structuredData.tags} ${text}`.split(' ')

  let keywords = []
  getKeywords(words.join(' ')).forEach(word => { 
    keywords.push({
      text: word,
      count: 0,
      sentances: []
    })
  })

  if (structuredData.tags) {
    structuredData.tags.map(async tag => {
      keywords.push({
        text: tag,
        count: 0,
        sentances: []
      })
    })
  }

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

  keywords.sort((a, b) => { return b.count - a.count })


  const articleHeadlineSentiment = SentimentIntensityAnalyzer.polarity_scores(structuredData.title)
  const articleTextSentiment = SentimentIntensityAnalyzer.polarity_scores(text)
  const articleOverallSentiment = SentimentIntensityAnalyzer.polarity_scores(`${structuredData.title} ${structuredData.description} ${text}`)

  let articleSentencesWithSentiment = []
  sentences.forEach(sentence => {
    articleSentencesWithSentiment.push({
      text: sentence,
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
  // @TODO Add language property to article
  // @TODO Add title property to article
  // @TODO Pass origional raw extracted text (i.e. not mangled!)
  // @TODO Document this! Including examples and where the data comes from in each case.
  const article = {
    url,
    sentences: articleSentencesWithSentiment,
    quotes,
    sentiment,
    wordCount,
    keywords,
    //topics,
    html,
    text: rawText.trim(),
    // @TODO Strip these from Elasticsearch to prevent schema conflicts?
    // Alternatively, can we indexed raw data in some other way that it
    // won't matter?
    metadata,
    structuredData,
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