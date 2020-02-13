const { addArticleToMongoDB } = require('lib/db/mongodb')
const { addArticleToElasticsearch } = require('lib/db/elasticsearch')

// Runs async, does not bother to return a response
const importArticle = (article) => {
  console.log("Importing article…", article)
  addArticleToMongoDB(article)
  addArticleToElasticsearch(article)  
}

module.exports = {
  importArticle
}