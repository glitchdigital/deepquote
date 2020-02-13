const { addArticleToMongoDB, addQuoteToMongoDB, getMongoDBCount } = require('lib/db/mongodb')
const { addArticleToElasticsearch, addQuoteToElasticsearch, getElasticsearchCount } = require('lib/db/elasticsearch')

const importArticle = async (article) => {
  console.log("MongoDB", await getMongoDBCount())
  console.log("Elasticsearch", await getElasticsearchCount())

  // Create quote object for every quote in an article
  const quotes = []
  article.quotes.forEach((quote) => {
    quotes.push({
      quote,
      url: article.url,
      quoteHash: require('crypto').createHash('sha1').update(`${article.url}\\${quote}`).digest('base64'),
      title: article.structuredData.title,
      date: article.structuredData.date,
      tags: article.keywords,
      publisher: article.structuredData.publisher,
      copyright: article.structuredData.copyright,
      author: (Array.isArray(article.structuredData.author)) ? article.structuredData.author.join(', ') : article.structuredData.author
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