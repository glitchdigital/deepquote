const { Client } = require('@elastic/elasticsearch')

const { send, queryParser } = require('lib/request-handler')
const { ELASTICSEARCH_URI, ELASTICSEARCH_QUOTE_INDEX } = require('lib/db/elasticsearch')

module.exports = async (req, res) => {
  const { t: searchText } = queryParser(req)

  // @TODO Read 'lang' from query string
  // @FIXME Temporarily hard coding as 'de' for now to hide other results
  const lang = 'de'

  // NB: Only returns results that are at least 3 words long
  try {
    const client = new Client({ node: ELASTICSEARCH_URI })
    const { body } = await client.search({
        index: ELASTICSEARCH_QUOTE_INDEX,
        body: { 
          query: { 
            bool: {
              must: [
                { match: { text: searchText } },
                { match: { lang } },
                { range: { wordCount: { gte: 3 } } }
              ]
            }
          }
        },
        from: 0,
        size: 100
      })
    return send(res, 200, body.hits.hits.map(quote => quote._source))
  } catch (e) {
    // @TODO return error
  }
}