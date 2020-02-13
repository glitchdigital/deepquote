const { Client } = require('@elastic/elasticsearch')

require('dotenv').config()

const ELASTICSEARCH_CONNECTION_STRING = process.env.ELASTICSEARCH_CONNECTION_STRING
const ELASTICSEARCH_INDEX_NAME = process.env.ELASTICSEARCH_INDEX_NAME

const addArticleToElasticsearch = async (article) => {
  const client = new Client({ node: ELASTICSEARCH_CONNECTION_STRING })

  const { body } = await client.search({
    index: ELASTICSEARCH_INDEX_NAME,
    body: { 
      query: {
        match_phrase: {
          url: article.url
        }
      }
    }
  })

  if (body.hits.hits.length > 0) {
    console.log("Updating existing article in Elasticsearch")
    await client.update({
      index: ELASTICSEARCH_INDEX_NAME,
      id: body.hits.hits[0]['_id'],
      body: { doc: article },
    })
    // @TODO Should update existing record in Elasticsearch
  } else {
    await client.index({
      index: ELASTICSEARCH_INDEX_NAME,
      body: article,
    })
    console.log("Indexed article in Elasticsearch")    
  }

  await client.indices.refresh({ index: ELASTICSEARCH_INDEX_NAME })

  if (process.env.NODE_ENV !== 'production') {
    const totalResults = await client.count({ index: ELASTICSEARCH_INDEX_NAME })
    console.log(`${totalResults.body.count} articles in Elasticsearch`)
  }
}

module.exports = {
  addArticleToElasticsearch
}