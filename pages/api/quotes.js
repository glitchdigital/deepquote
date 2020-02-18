// const { Base58 } = require('base58')
const { Client } = require('@elastic/elasticsearch')

const { send, queryParser } = require('lib/request-handler')
const { ELASTICSEARCH_URI, ELASTICSEARCH_QUOTE_INDEX } = require('lib/db/elasticsearch')

module.exports = async (req, res) => {
  const client = new Client({ node: ELASTICSEARCH_URI })
  const { body } = await client.search({
    index: ELASTICSEARCH_QUOTE_INDEX,
    body: {},
    from: 0,
    size: 100
  })

  return send(res, 200, body.hits.hits.map(quote => quote._source))
}