const crypto = require('crypto')

const mongo = require('lib/db/mongo')
const elasticsearch = require('lib/db/elasticsearch')

const addArticle = async (article) => {
  await Promise.all([
    mongo.addArticle(article),
    elasticsearch.addArticle(article)
  ])

  return Promise.resolve()
}

const addQuotesFromArticle = async (article) => {
  // Create a new quote object for every quote in an article.
  //
  // Note: The hash of the text of the quote and the article URL is used as a primary key.
  // i.e. There can be two quotes with exactly the same text, but in different articles.
  // They might refer to the same quote or they might be quoting two totally different sources.
  //
  // When a search for a quote is made, all mentions of a quote will be returned.
  // This can be done with strict matching OR fuzzy matching (based on user preference)
  // and the results combined in the UI, with sources/mentions ordered by date.
  //
  // In future, fuzzy matches may be pre-calculated so as to group results together.
  const quotes = []
  article.quotes.forEach((quote) => {
    quotes.push({
      hash: crypto.createHash('sha1').update(`${article.url}\\${quote.text}`, 'utf8').digest('hex'),
      text: quote.text,
      lang: article.lang,
      source: {
        // The only 'source type' is currently 'article', this could be expanded in future.
        // Some basic metadata that needed to present the result in the user interface is
        // is included in the 'source'. The property names are inspired by schema.org
        // properties, with the anticipation that there may be different source types in
        // the future (e.g. transcripts, videos, images, etc).
        type: 'article',
        url: article.url,
        name: article.title,
        lang: article.lang,
        datePublished: article.datePublished,
        publisher: article.metadata.unfluff?.publisher,
        keywords: article.keywords.map(keyword => keyword.text)
      }
    })
  })
  
  await Promise.all(quotes.map(async quote => await mongo.addQuote(quote)))
  await Promise.all(quotes.map(async quote => await elasticsearch.addQuote(quote)))

  return Promise.resolve()
}

module.exports = {
  addArticle,
  addQuotesFromArticle
}