const MongoClient = require('mongodb').MongoClient

require('dotenv').config()

const MONGO_DB_CONNECTION_STRING = process.env.MONGO_DB_CONNECTION_STRING
const MONGO_DB_NAME = process.env.MONGO_DB_NAME
const MONGO_DB_COLLECTION = process.env.MONGO_DB_COLLECTION

const addArticleToMongoDB = (article) => {
  MongoClient.connect(MONGO_DB_CONNECTION_STRING, (err, client) => {
    if (err) return console.error("Unable to connect to MongoDB", err)
    
    const db = client.db(MONGO_DB_NAME)
    db.collection(MONGO_DB_COLLECTION).replaceOne({
      url: article.url
    }, article,  { upsert: true }, async (err, result) => {
      if (err) return console.error("Error inserting article to MongoDB", err)
      console.log("Indexed article in MongoDB")

      if (process.env.NODE_ENV !== 'production') {
        const totalResults = await db.collection(MONGO_DB_COLLECTION).countDocuments()
        console.log(`${totalResults} articles in MongoDB`)
      }
    
      client.close()
    })
  })
}

module.exports = {
  addArticleToMongoDB
}