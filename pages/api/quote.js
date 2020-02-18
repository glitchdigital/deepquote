// const { Base58 } = require('base58')
const { Client } = require('@elastic/elasticsearch')

const { send, queryParser } = require('lib/request-handler')
const { ELASTICSEARCH_URI, ELASTICSEARCH_QUOTE_INDEX } = require('lib/db/elasticsearch')

module.exports = async (req, res) => {
  const { id, fuzzy } = queryParser(req)

  const client = new Client({ node: ELASTICSEARCH_URI })
  const findQuoteByIdResult = await client.search({
    index: ELASTICSEARCH_QUOTE_INDEX,
    body: { query: { match_phrase: { hash: id } } },
  })

  const quote = findQuoteByIdResult.body.hits.hits[0]._source
  quote.citations = [ quote.source ]

  // First, find other exact matches for the quote
  const findOtherInstancesOfQuoteResult = await client.search({
    index: ELASTICSEARCH_QUOTE_INDEX,
    body: { query: { match_phrase: { text: quote.text } } },
    from: 0,
    size: 100
  })

  findOtherInstancesOfQuoteResult.body.hits.hits.forEach((result,i) => {
    const newCitation = result._source.source
    newCitation.exactMatch = true // Indicate this is an exact match
    if (!quote.citations.some(citation => citation.url == newCitation.url)) {
      quote.citations.push(newCitation)
    }
  })

  if (fuzzy && fuzzy === 'true') {
    //Find other non-exact potential matches for the quote
    const findOtherSimilarQuotesResult = await client.search({
      index: ELASTICSEARCH_QUOTE_INDEX,
      body: { query: { match: { text: quote.text } } },
      from: 0,
      size: 100
    })

    findOtherSimilarQuotesResult.body.hits.hits.forEach((result,i) => {
      const newCitation = result._source.source
      newCitation.exactMatch = false // Indicate this is not an exact match
      if (!quote.citations.some(citation => citation.url == newCitation.url)) {
        quote.citations.push(newCitation)
      }
    })
  }

  // Sort results by date of publication (oldest first)
  quote.citations.sort((a, b) => { return a.datePublished - b.datePublished })

  return send(res, 200, quote)
}