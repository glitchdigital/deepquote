const MongoClient = require('mongodb').MongoClient

require('dotenv').config()

const MONGO_DB_CONNECTION_STRING = process.env.MONGO_DB_CONNECTION_STRING
const MONGO_DB_NAME = process.env.MONGO_DB_NAME
const MONGO_DB_ARTICLE_COLLECTION = 'articles'
const MONGO_DB_QUOTE_COLLECTION = 'quotes'

let cachedDb = null;

const connectToDatabase = (uri) => {
  if (cachedDb) return Promise.resolve(cachedDb)

  return MongoClient.connect(uri, { useUnifiedTopology: true })
  .then(db => {
    cachedDb = db;
    return cachedDb;
  })
}

const addArticleToMongoDB = (article) => {
  return new Promise(async(resolve) => {
    await connectToDatabase(MONGO_DB_CONNECTION_STRING)
    const db = cachedDb.db(MONGO_DB_NAME)
    db.collection(MONGO_DB_ARTICLE_COLLECTION).replaceOne({
      url: article.url
    }, article, { upsert: true }, async (err, result) => {
      if (err) return console.error("Error indexing article in MongoDB", err)
      resolve()    
    })
  })
}

const addQuoteToMongoDB = (quote) => {
  return new Promise(async(resolve) => {
    await connectToDatabase(MONGO_DB_CONNECTION_STRING)
    const db = cachedDb.db(MONGO_DB_NAME)
    db.collection(MONGO_DB_QUOTE_COLLECTION).replaceOne({
      quoteHash: quote.quoteHash
    }, quote, { upsert: true }, async (err, result) => {
      if (err) return console.error("Error indexing quote in MongoDB", err)
      resolve()    
    })
  })
}

const getMongoDBCount = () => {
  return new Promise(async(resolve) => {
    await connectToDatabase(MONGO_DB_CONNECTION_STRING)
    const db = cachedDb.db(MONGO_DB_NAME)
    const articleCount = await db.collection(MONGO_DB_ARTICLE_COLLECTION).countDocuments()
    const quoteCount = await db.collection(MONGO_DB_QUOTE_COLLECTION).countDocuments()
    resolve({ 
      articleCount,
      quoteCount
    })    
  })
}

module.exports = {
  addArticleToMongoDB,
  addQuoteToMongoDB,
  getMongoDBCount
}