const { Client } = require('@elastic/elasticsearch')

require('dotenv').config()

const ELASTICSEARCH_CONNECTION_STRING = process.env.ELASTICSEARCH_CONNECTION_STRING
const ELASTICSEARCH_INDEX_NAME = process.env.ELASTICSEARCH_INDEX_NAME

const addArticleToElasticsearch = (article) => {
  return new Promise(async(resolve) => {
    const client = new Client({ node: ELASTICSEARCH_CONNECTION_STRING })
    const { body } = await client.search({
      index: ELASTICSEARCH_INDEX_NAME,
      body: { 
        query: { match_phrase: { url: article.url } }
      }
    })
  
    if (body.hits.hits.length > 0) {
      // Update existing article
      await client.update({
        index: ELASTICSEARCH_INDEX_NAME,
        id: body.hits.hits[0]['_id'],
        body: { doc: article },
      })
    } else {
      // Insert new article
      await client.index({
        index: ELASTICSEARCH_INDEX_NAME,
        body: article,
      })
    }

    // Update index after inserting so next search/count includes changes saved here
    await client.indices.refresh({ index: ELASTICSEARCH_INDEX_NAME })
    
    resolve()
  })
}

const getElasticsearchArticleCount = (article) => {
  return new Promise(async(resolve) => {
    const client = new Client({ node: ELASTICSEARCH_CONNECTION_STRING })
    const countResult = await client.count({ index: ELASTICSEARCH_INDEX_NAME })
    resolve(countResult.body.count)
  })
}


module.exports = {
  addArticleToElasticsearch,
  getElasticsearchArticleCount
}