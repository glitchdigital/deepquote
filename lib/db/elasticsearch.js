const { Client } = require('@elastic/elasticsearch')

require('dotenv').config()

const ELASTICSEARCH_CONNECTION_STRING = process.env.ELASTICSEARCH_CONNECTION_STRING
const ELASTICSEARCH_ARTICLE_INDEX_NAME = 'articles'
const ELASTICSEARCH_QUOTE_INDEX_NAME = 'quotes'

const addArticleToElasticsearch = (article) => {
  return new Promise(async(resolve) => {
    const client = new Client({ node: ELASTICSEARCH_CONNECTION_STRING })
    const { body } = await client.search({
      index: ELASTICSEARCH_ARTICLE_INDEX_NAME,
      body: { 
        query: { match_phrase: { url: article.url } }
      }
    })
  
    let query = {
      index: ELASTICSEARCH_QUOTE_INDEX_NAME,
      body: article,
    }

    if (body.hits.hits.length > 1)
      console.error("The same URL was found more than once in Elasticsearch:", article.url)

    if (body.hits.hits.length > 0)
      query.id = body.hits.hits[0]['_id']

    await client.index({
      index: ELASTICSEARCH_ARTICLE_INDEX_NAME,
      body: article,
      refresh: true
    })
    resolve()
  })
}

const addQuoteToElasticsearch = (quote) => {
  return new Promise(async(resolve) => {
    const client = new Client({ node: ELASTICSEARCH_CONNECTION_STRING })
    const { body } = await client.search({
      index: ELASTICSEARCH_QUOTE_INDEX_NAME,
      body: { 
        query: { match_phrase: { quoteHash: quote.quoteHash } }
      }
    })
  
    let query = {
      index: ELASTICSEARCH_QUOTE_INDEX_NAME,
      body: quote,
    }

    if (body.hits.hits.length > 1)
      console.error("The same quote was found more that once in Elasticsearch:", quote.quoteHash)

    if (body.hits.hits.length > 0)
      query.id = body.hits.hits[0]['_id']

    await client.index({
      index: ELASTICSEARCH_QUOTE_INDEX_NAME,
      body: quote,
      refresh: true
    })

    resolve()
  })
}

const getElasticsearchCount = () => {
  return new Promise(async(resolve) => {
    const client = new Client({ node: ELASTICSEARCH_CONNECTION_STRING })
    const articleCountResult = await client.count({ index: ELASTICSEARCH_ARTICLE_INDEX_NAME })
    const quoteCountResult =  await client.count({ index: ELASTICSEARCH_QUOTE_INDEX_NAME })
    resolve({
      articleCount: articleCountResult.body.count,
      quoteCount: quoteCountResult.body.count,
    })
  })
}

module.exports = {
  addArticleToElasticsearch,
  addQuoteToElasticsearch,
  getElasticsearchCount,
  ELASTICSEARCH_CONNECTION_STRING,
  ELASTICSEARCH_ARTICLE_INDEX_NAME,
  ELASTICSEARCH_QUOTE_INDEX_NAME
}