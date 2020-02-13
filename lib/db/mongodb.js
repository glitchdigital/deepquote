const MongoClient = require('mongodb').MongoClient

require('dotenv').config()

const MONGO_DB_CONNECTION_STRING = process.env.MONGO_DB_CONNECTION_STRING
const MONGO_DB_NAME = process.env.MONGO_DB_NAME
const MONGO_DB_COLLECTION = process.env.MONGO_DB_COLLECTION

let cachedDb = null;

const connectToDatabase = (uri) => {
  if (cachedDb) return Promise.resolve(cachedDb)

  return MongoClient.connect(uri, { useUnifiedTopology: true })
  .then(db => {
    cachedDb = db;
    return cachedDb;
  })
}

const addArticleToMongoDB = async (article) => {
  return new Promise(async(resolve) => {
    await connectToDatabase(MONGO_DB_CONNECTION_STRING)

    const db = cachedDb.db(MONGO_DB_NAME)
    db.collection(MONGO_DB_COLLECTION).replaceOne({
      url: article.url
    }, article, { upsert: true }, async (err, result) => {
      if (err) return console.error("Error indexing article in MongoDB", err)

      console.log("Indexed article in MongoDB")

      //if (process.env.NODE_ENV !== 'production') {
        const totalResults = await db.collection(MONGO_DB_COLLECTION).countDocuments()
        console.log(`${totalResults} articles in MongoDB`)
      //}

      resolve()    
    })
  })
}

module.exports = {
  addArticleToMongoDB
}