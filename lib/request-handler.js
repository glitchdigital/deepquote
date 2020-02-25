// Setting these handlers here for each endpoint makes maintenance easier
const { send } = require('micro')
const microQuery = require('micro-query')

const { DEFAULT_CACHE_CONTROL_HEADER } = require('lib/cache-control')

const sendResponse = (res, statusCode, message) => {
  res.setHeader('Cache-Control', DEFAULT_CACHE_CONTROL_HEADER)
  return send(res, statusCode, message)
}

module.exports = {
  queryParser: microQuery,
  send: sendResponse
}