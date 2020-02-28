/* FIXME 🚨This code is especially terrible and needs refactoring 🚨*/
const sbdTokenizer = require('sbd')
const SentimentIntensityAnalyzer = require('vader-sentiment').SentimentIntensityAnalyzer
const stopwords = require('stopwords-en')
const unfluff = require('unfluff')
const Readability = require('readability')
const JSDOM = require("jsdom").JSDOM
const WAE = require('web-auto-extractor').default
const moment = require('moment')

function parseArticle(url, html) {
  return new Promise(async (resolve, reject) => {
    // Parse HTML and extract metadata and article text
    // Note: The URL of the article is required for article text parsing to work well

    let { metadata, text } = await _extractTextAndMetadata(url, html)

    const title = metadata.unfluff?.title

    // @TODO Validate lang value!
    const lang = metadata.unfluff?.lang || 'en'

    const datePublished = _getDatePublishedFromMetadata(metadata, url)

    // Get quotes in text
    const quotes = getQuotes(text).map(quote => {
      return { 
        text: quote,
        count: 0,
        sentences: [],
        sentiment: {
          posCount: 0,
          negCount: 0,
          neuCount: 0
        }
      }
    })

    // Get sentences in text
    // Add a full stop after the end of every line, if there is not one already to make tokenizing work better
    const textWithFullStops = text.replace(/([^\.])\n/g, "$1.\n")
    const sentences = sbdTokenizer.sentences(textWithFullStops, { newline_boundaries: true, html_boundaries: true }).map(sentence => {
      return {
        text: sentence,
        length: sentence.replace(/\n/g, ' ').length,
        // Experimental: Evaluate the sentiment of each sentence.
        sentiment: SentimentIntensityAnalyzer.polarity_scores(sentence.replace(/\n/g, ' '))
      }
    })
    
    // Build word list
    let words = `${metadata.unfluff.title} ${metadata.unfluff.description} ${metadata.unfluff.tags} ${text}`.split(' ')

    let keywords = []
    getKeywords(words.join(' ')).forEach(word => { 
      keywords.push({
        text: word,
        count: 0,
        sentences: [],
        sentiment: {
          posCount: 0,
          negCount: 0,
          neuCount: 0
        }
      })
    })

    if (metadata.unfluff.tags) {
      metadata.unfluff.tags.map(async tag => {
        keywords.push({
          text: tag,
          count: 0,
          sentences: [],
          sentiment: {
            posCount: 0,
            negCount: 0,
            neuCount: 0
          }
        })
      })
    }

    sentences.forEach(sentence => {
      const sentenceText = sentence.text
      const sentenceSentiment = sentence.sentiment

      // If the sentence contains a quote, reference this sentence with the quote
      quotes.forEach(quote => {
        if (sentenceText.toLowerCase().includes(quote.text.toLowerCase())) {
          quote.count++
          if (!quote.sentences.includes(sentenceText))
            quote.sentences.push(sentenceText)
  
            // Experimental: Track the sentiment of each sentence the quote appears in
            if (sentenceSentiment.pos > sentenceSentiment.neg) {
              quote.sentiment.posCount++
            } else if (sentenceSentiment.neg > sentenceSentiment.pos && sentenceSentiment.neg > sentenceSentiment.neu) {
              quote.sentiment.negCount++
            } else {
              quote.sentiment.neuCount++
            }
        }
      })

      // If the sentence contains a keyword, reference this sentence with the keyword
      keywords.forEach(keyword => {
        if (sentenceText.toLowerCase().includes(keyword.text.toLowerCase())) {
          keyword.count++
          if (!keyword.sentences.includes(sentenceText))
            keyword.sentences.push(sentenceText)

          // Experimental: Track the sentiment of each sentence the keyword appears in
          if (sentenceSentiment.pos > sentenceSentiment.neg) {
            keyword.sentiment.posCount++
          } else if (sentenceSentiment.neg > sentenceSentiment.pos && sentenceSentiment.neg > sentenceSentiment.neu) {
            keyword.sentiment.negCount++
          } else {
            keyword.sentiment.neuCount++
          }
        }
      })
    })

    keywords.sort((a, b) => { return b.count - a.count })

    const articleHeadlineSentiment = SentimentIntensityAnalyzer.polarity_scores(metadata.unfluff.title)
    const articleTextSentiment = SentimentIntensityAnalyzer.polarity_scores(text)
    const articleOverallSentiment = SentimentIntensityAnalyzer.polarity_scores(`${metadata.unfluff.title} ${metadata.unfluff.description} ${text}`)

    const sentiment = {
      headline: articleHeadlineSentiment,
      text: articleTextSentiment,
      overall: articleOverallSentiment
    }

    const wordCount = text.split(' ').length;

    // We don't need structured data text property, as full text extraction is much more sophisticated
    if (metadata.unfluff.text) delete metadata.unfluff.text

    // Construct article object to return
    // @TODO Document this! Including examples and where the data comes from in each case.
    const article = {
      url,
      lang,
      title,
      datePublished,
      sentences,
      quotes,
      sentiment,
      wordCount,
      keywords,
      html,
      text,
      metadata // NB: Do not publish this value to Elasticsearch as schema varies between articles
    }

    resolve(article)
  })
}

module.exports = {
  parseArticle
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

function getQuotes(text) {
  let normalizedtext = text

  // Normalize English quotation marks
  normalizedtext = normalizedtext.replace(/[“”]/g, '"')

  // Normalize German quotation marks
  normalizedtext = normalizedtext.replace(/[„“]/g, '"')

  // Normalize French quotation marks
  normalizedtext = normalizedtext.replace(/[«»]/g, '"')

  const rawQuotes = normalizedtext.match(/(["])(\\?.)*?\1/gm) || []
  let quotes = []
  
  rawQuotes.forEach(quote => {
    const trimmedQuote = quote.trim().replace(/^"/, '').replace(/"$/, '').trim()
    quotes.push(trimmedQuote)
  })
  
  return _getUniqueQuotes(quotes)
}

function _getUniqueQuotes(quotes) {
  let uniqueQuotes = {}

  quotes.forEach(quote => {
    const key = quote.toLowerCase()
    uniqueQuotes[key] = quote
  })

  return Object.values(uniqueQuotes)
}

function _extractTextAndMetadata(url, rawHtml) {
  // OPTIMIZATION
  // Replaces all instances of more than one space (or tab, etc) in
  // the HTML with a single space.
  //
  // This improves performance, especially on pages that have a lot of
  // blank space as that slows down all parsers, especially Unfluff 
  // and Readability.
  //
  // Example of problematic URL:
  // https://rp-online.de/politik/deutschland/integrationspolitik-carsten-linnemann-zu-deutschkenntnissen-in-grundschulen_aid-44771807
  const html = rawHtml.replace(/\s\s+/gm, ' ')

  // @TODO Look at https://metascraper.js.org

  // Get Metadata
  const webAutoExtractorResult = WAE().parse(html)

  // Parse HTML into structured format
  // @FIXME Unfluff can be slow on some articles.
  // It has a lazy mode that might be faster, but it needs a language property.
  // https://github.com/ageitgey/node-unfluff
  const unfluffResult = unfluff(html)

  // Parse for text using Readability
  const dom = new JSDOM(html, { url, omitJSDOMErrors: true })
  const reader = new Readability(dom.window.document)
  const readabilityResult = reader.parse()

  // Get article text using Readability if possible, fallback to structured data for extraction
  const text = new String(readabilityResult ? readabilityResult.textContent || unfluffResult.text || '' : '').trim()
  
  return {
    metadata: {
      'web-auto-extractor': webAutoExtractorResult,
      unfluff: unfluffResult,
      readability: readabilityResult
    },
    text
  }
}

function _getDatePublishedFromMetadata(metadata, url) {
  // An approach to extracting article publication dates designed to work with a wide range of articles
  let datePublished

  // Try looping through micordata schemas for the article
  for (const schema in metadata['web-auto-extractor'].microdata) {
    for (const i in  metadata['web-auto-extractor'].microdata[schema]) {
      // Important: Check the schema actually refers to URL specified (pages can contain multiple schemas)
      if (metadata['web-auto-extractor'].microdata[schema][i]?.url == url ||
          metadata['web-auto-extractor'].microdata[schema][i]?.mainEntityOfPage == url) {
        datePublished = Date.parse(metadata['web-auto-extractor'].microdata[schema][i]?.datePublished)
      }
    }
  }

  // If no valid date yet, try looping through jsonld schemas for the article
  if (isNaN(datePublished)) {
    for (const schema in metadata['web-auto-extractor'].jsonld) {
      for (const i in  metadata['web-auto-extractor'].jsonld[schema]) {
        // Important: Check the schema actually refers to URL specified (pages can contain multiple schemas)
        if (metadata['web-auto-extractor'].jsonld[schema][i]?.url == url ||
            metadata['web-auto-extractor'].jsonld[schema][i]?.mainEntityOfPage == url) {
          datePublished = Date.parse(metadata['web-auto-extractor'].jsonld[schema][i]?.datePublished)
        }
      }
    }
  }

  // If no valid date yet, try looking in the metatags
  if (isNaN(datePublished)) {
    datePublished = Date.parse(metadata['web-auto-extractor'].metatags?.datePublished?.[0])
  }

  // If no valid date yet, try parsing whatever unfluff extracted
  if (isNaN(datePublished)) {
    datePublished = Date.parse(metadata.unfluff?.date)
  }

  // If that didn't work try parsing the value unfluff extracted as as a local date string
  // (this works when a date has been specified in a local format rather than an ISO timestamp)
  if (isNaN(datePublished)) {
    // Assume date is in ISO or US format by default.
    //
    // Only try pasring using moment with locale *if* date fails to
    // parse any other way, this is because most publishers use ISO
    // or US date formats even with non en-US locale and that
    // confuses the parser.
    const lang = metadata.unfluff?.lang || 'en'
    datePublished =  Date.parse(moment(metadata.unfluff?.date, 'L', lang))
  }

  return datePublished
}