const { Client } = require('@elastic/elasticsearch')

require('dotenv').config()

const ELASTICSEARCH_URI = process.env.ELASTICSEARCH_URI
const ELASTICSEARCH_ARTICLE_INDEX = 'articles'
const ELASTICSEARCH_QUOTE_INDEX = 'quotes'

function addArticle(article) {
  return new Promise(async(resolve, reject) => {
    try {
      const client = new Client({ node: ELASTICSEARCH_URI })
      const { body } = await client.search({
        index: ELASTICSEARCH_ARTICLE_INDEX,
        body: { query: { match_phrase: { url: article.url } } }
      })

      // When inserting articles into Elasticsearch, we have to
      // explicitly list only fields we know are consistant across
      // all articles.
      //
      // We don't want to include all uncleaned metadata, because 
      // not all articles use metadata in the same way, and
      // inserting all of it would result in errors while indexing
      // as elasticsearch requires all documents in an index
      // follow the same structure.
      let insertQuery = {
        index: ELASTICSEARCH_ARTICLE_INDEX,
        body: {
          url: article.url,
          text: article.text,
          html: article.html
        },
        refresh: true
      }

      if (body.hits.hits.length > 1) {
        return reject(`Error: The same URL was found ${body.hits.hits.length} times in Elasticsearch`, article.url)
      }

      // If already exists in Elasticsearch, use ID to trigger update instead of insert
      if (body.hits.hits.length > 0)
        insertQuery.id = body.hits.hits[0]['_id']

      await client.index(insertQuery)

      resolve()
    } catch (e) {
      console.error(`Error adding article to Elasticsearch`, e)
      reject()
    }
  })
}

function addQuote(quote) {
  return new Promise(async(resolve, reject) => {
    try {
      const client = new Client({ node: ELASTICSEARCH_URI })
      const { body } = await client.search({
        index: ELASTICSEARCH_QUOTE_INDEX,
        body: { query: { match_phrase: { hash: quote.hash } } }
      })
    
      let insertQuery = {
        index: ELASTICSEARCH_QUOTE_INDEX,
        body: quote,
        refresh: true
      }

      if (body.hits.hits.length > 1) {
        return reject(`Error: The same quote was found ${body.hits.hits.length} times in Elasticsearch`, quote.hash)
      }

      // If already exists in Elasticsearch, use ID to trigger update instead of insert
      if (body.hits.hits.length > 0)
      insertQuery.id = body.hits.hits[0]['_id']

      await client.index(insertQuery)

      resolve()
    } catch (e) {
      console.error(`Error adding quote to Elasticsearch`, quote)
      reject()
    }
  })
}

function count() {
  return new Promise(async(resolve) => {
    const client = new Client({ node: ELASTICSEARCH_URI })
    const articleCountResult = await client.count({ index: ELASTICSEARCH_ARTICLE_INDEX })
    const quoteCountResult =  await client.count({ index: ELASTICSEARCH_QUOTE_INDEX })
    resolve({
      articles: articleCountResult.body.count,
      quotes: quoteCountResult.body.count,
    })
  })
}

module.exports = {
  ELASTICSEARCH_URI,
  ELASTICSEARCH_ARTICLE_INDEX,
  ELASTICSEARCH_QUOTE_INDEX,
  addArticle,
  addQuote,
  count
}