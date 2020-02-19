const { send, queryParser } = require('lib/request-handler')
const mongo = require('lib/db/mongo')
const elasticsearch = require('lib/db/elasticsearch')


module.exports = async (req, res, callback) => {
  return send(res, 200, {
    mongo: await mongo.count(),
    elasticsearch: await elasticsearch.count()
  })
}