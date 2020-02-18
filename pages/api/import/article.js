const { send, queryParser } = require('lib/request-handler')
const { fetchArticle, parseArticle } = require('lib/article')
const { addArticle, addQuotesFromArticle } = require('lib/db')

module.exports = async (req, res, callback) => {
  res.callbackWaitsForEmptyEventLoop = false;

  const { url } = queryParser(req)

  if (!url)
    return send(res, 400, { error: 'URL parameter missing' })

  // Scrape URL and extract metadata
  const html = await fetchArticle(url)
  const article = await parseArticle(url, html)

  // Save article to database
  await addArticle(article)

  // Save all quotes in article to database
  await addQuotesFromArticle(article)

  send(res, 200, { url, success: true})

  // Trigger AWS Lambda to be frozen
  if (callback) return callback(null, article)
}
