const { send, queryParser } = require('lib/request-handler')
const { getMongoDBCount } = require('lib/db/mongodb')
const { getElasticsearchCount } = require('lib/db/elasticsearch')


module.exports = async (req, res, callback) => {
  return send(res, 200, {
    mongodb: await getMongoDBCount(),
    elasticsearch: await getElasticsearchCount()
  })
}