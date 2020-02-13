const { addArticleToMongoDB } = require('lib/db/mongodb')
const { addArticleToElasticsearch } = require('lib/db/elasticsearch')

const importArticle = async (article) => {
  console.log("Importing article", article.url)
  await Promise.all([
    addArticleToMongoDB(article),
    addArticleToElasticsearch(article)  
  ])
}

module.exports = {
  importArticle
}