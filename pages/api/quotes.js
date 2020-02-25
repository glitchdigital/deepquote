const { Client } = require('@elastic/elasticsearch')

const { send, queryParser } = require('lib/request-handler')
const { ELASTICSEARCH_URI, ELASTICSEARCH_QUOTE_INDEX } = require('lib/db/elasticsearch')

module.exports = async (req, res) => {
  // @TODO Read 'lang' from query string
  // @FIXME Temporarily hard coding as 'de' for now to hide other results
  const lang = 'de'

  try {
    const client = new Client({ node: ELASTICSEARCH_URI })
    const { body } = await client.search({
      index: ELASTICSEARCH_QUOTE_INDEX,
      body: { 
        query: { match_phrase: { lang } },
        collapse: {
          field: 'text.keyword',
          inner_hits: {
            name: "source.datePublished",
            size: 1
          }
        }
      },
      from: 0,
      size: 3 * 10
    })
    return send(res, 200, body.hits.hits.map(quote => quote._source))
  } catch (e) {
    // @TODO return error
  }
}