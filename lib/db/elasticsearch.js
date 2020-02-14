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
  
    if (body.hits.hits.length > 0) {
      // Update existing article
      await client.update({
        index: ELASTICSEARCH_ARTICLE_INDEX_NAME,
        id: body.hits.hits[0]['_id'],
        body: { doc: article },
      })
    } else {
      // Insert new article
      await client.index({
        index: ELASTICSEARCH_ARTICLE_INDEX_NAME,
        body: article,
      })
    }

    // Update index after inserting so next search/count includes changes saved here
    await client.indices.refresh({ index: ELASTICSEARCH_ARTICLE_INDEX_NAME })
    
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
  
    if (body.hits.hits.length > 0) {
      // Update existing quote
      await client.update({
        index: ELASTICSEARCH_QUOTE_INDEX_NAME,
        id: body.hits.hits[0]['_id'],
        body: { doc: quote },
      })
    } else {
      // Insert new quote
      await client.index({
        index: ELASTICSEARCH_QUOTE_INDEX_NAME,
        body: quote,
      })
    }

    // Update index after inserting so next search/count includes changes saved here
    await client.indices.refresh({ index: ELASTICSEARCH_QUOTE_INDEX_NAME })
    
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