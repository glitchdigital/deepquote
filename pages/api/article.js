const { Client } = require('@elastic/elasticsearch')

const { send, queryParser } = require('lib/request-handler')
const { ELASTICSEARCH_URI, ELASTICSEARCH_ARTICLE_INDEX } = require('lib/db/elasticsearch')

module.exports = async (req, res) => {
  const { url } = queryParser(req)

  const client = new Client({ node: ELASTICSEARCH_URI })
  const { body } = await client.search({
    index: ELASTICSEARCH_ARTICLE_INDEX,
    body: { query: { match_phrase: { url } } } 
  })

  return send(res, 200, body.hits.hits[0]._source)
}