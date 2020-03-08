const MongoClient = require('mongodb').MongoClient

require('dotenv').config()

const MONGO_URI = process.env.MONGO_URI
const MONGO_ARTICLE_COLLECTION = 'articles'
const MONGO_QUOTE_COLLECTION = 'quotes'

// Save DB connection after first time connect() is called
let _db = null

function connect() {
  // If we already have a connection, return it (don't connect again)
  if (_db) return Promise.resolve(_db)

  const uri = MONGO_URI
  return MongoClient.connect(uri, { useUnifiedTopology: true })
  .then(mongoClient => {
    // Get DB name from connection string (first item in path after host:post)
    const dbName = uri.split('/').pop().split('?').shift()
    _db = mongoClient.db(dbName)
    return _db
  })
}

function addArticle(article) {
  return new Promise(async(resolve) => {
    const db = await connect()
    db.collection(MONGO_ARTICLE_COLLECTION).replaceOne({
      url: article.url
    }, article, { upsert: true }, async (err, result) => {
      if (err) return console.error("Error indexing article in MongoDB", err)
      resolve(article)
    })
  })
}

function getArticle(url) {
  return new Promise(async(resolve) => {
    const db = await connect()
    db.collection(MONGO_ARTICLE_COLLECTION).findOne({ url }, async (err, result) => {
      if (err) return console.error("Error searching for article in MongoDB", err)
      resolve(result)
    })
  })
}

function addQuote(quote) {
  return new Promise(async(resolve) => {
    const db = await connect()
    db.collection(MONGO_QUOTE_COLLECTION).replaceOne({
      hash: quote.hash
    }, quote, { upsert: true }, async (err, result) => {
      if (err) return console.error("Error indexing quote in MongoDB", err)
      resolve()
    })
  })
}

function count() {
  return new Promise(async(resolve) => {
    const db = await connect()
    const articleCount = await db.collection(MONGO_ARTICLE_COLLECTION).countDocuments()
    const quoteCount = await db.collection(MONGO_QUOTE_COLLECTION).countDocuments()
    resolve({ 
      articles: articleCount,
      quotes: quoteCount
    })
  })
}

module.exports = {
  MONGO_URI,
  MONGO_ARTICLE_COLLECTION,
  MONGO_QUOTE_COLLECTION,
  connect,
  addArticle,
  getArticle,
  addQuote,
  count,
}