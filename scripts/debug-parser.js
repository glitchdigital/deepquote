// Script to make it easier to debug when working on the the article parser
// by making it easier to run HTML from the database through it.
// Reads from databases but does not write to them.
require('app-module-path').addPath(`${__dirname}/..`)

const { MONGO_ARTICLE_COLLECTION, connect, count: mongoCount } = require('lib/db/mongo')
const { count: elasticsearchCount } = require('lib/db/elasticsearch')
const { fetchArticle, parseArticle } = require('lib/article')

// Set `FORCE_RECRAWL` to true to re-fetch the HTML from the URL instead of using cached HTML
const FORCE_RECRAWL = false

;(async () => {
  try {
    const db = await connect()

    console.log("MongoDB:", await mongoCount())
    console.log("Elasticsearch:", await elasticsearchCount(), "\n")

    const cursor = db.collection(MONGO_ARTICLE_COLLECTION).find().addCursorFlag('noCursorTimeout', true) // noCursorTimeout required for long running scripts
    
    while (cursor.hasNext()) {
      try {
        // Get each result and iterate over synchronously (exit while loop when no more results)
        const doc = await cursor.next().then(doc => doc).catch(e => null)
        if (doc === null) break

        // Skip articles that don't have a URL for some reason
        if (!doc.url) continue

        let article = {}
        if (FORCE_RECRAWL === true || !doc.html) {
          console.log(`> Fetching HTML for ${doc.url}`)
          const { html } = await fetchArticle(doc.url)
          article = await parseArticle(doc.url, html)
        } else {
          console.log(`> Parsing HTML for ${doc.url}`)
          article = await parseArticle(doc.url, doc.html)
        }

        console.log(" * Parsed article")

      } catch (e) {
        console.error(`Error iterating over MongoDB collection`, e)
        continue
      }
    }

    cursor.close()
    process.exit()
  } catch (e) {
    console.error("An error occured", e)
    process.exit()
  }
})()