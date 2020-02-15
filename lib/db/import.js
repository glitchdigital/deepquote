const { Base58 } = require('base58')
const crypto = require('crypto')

const { addArticleToMongoDB, addQuoteToMongoDB, getMongoDBCount } = require('lib/db/mongodb')
const { addArticleToElasticsearch, addQuoteToElasticsearch, getElasticsearchCount } = require('lib/db/elasticsearch')

const importArticle = async (article) => {
  // Create quote object for every quote in an article
  const quotes = []
  article.quotes.forEach((quote) => {
    const hash = crypto.createHash('sha256')
    quotes.push({
      ['@id']: hash,
      text: quote,
      sameAs: [],
      citations: [{
          type: 'article',
          hash: crypto.createHash('sha256').update(`${article.url}\\${quote.trim()}`, 'utf8').digest(),
          url: article.url,
          title: article.structuredData.title,
          date: article.structuredData.date,
          tags: article.keywords,
          // @TODO Force publisher / copyright / author into objects to prevent schema conflicts
          // Currently some might be strings, others might be objects, others might be arrays (of strings or objects!)
          publisher: (String(article.structuredData.publisher) === article.structuredData.publisher) ? article.structuredData.publisher : '',
          copyright: (String(article.structuredData.copyright) === article.structuredData.copyright) ? article.structuredData.copyright : '',
          author: (String(article.structuredData.author) === article.structuredData.author) ? article.structuredData.author : ''
      }]
    })
  })

  await Promise.all([
    addArticleToMongoDB(article),
    addArticleToElasticsearch(article),
  ])

  await Promise.all(quotes.map(async quote => await addQuoteToMongoDB(quote)))
  await Promise.all(quotes.map(async quote => await addQuoteToElasticsearch(quote)))

  return Promise.resolve()
}

module.exports = {
  importArticle
}