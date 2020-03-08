require('app-module-path').addPath(`${__dirname}/..`)

const {
  MONGO_ARTICLE_COLLECTION, 
  connect, 
  count: mongoCount,
  getArticle
} = require('lib/db/mongo')
const { addArticle, addQuotesFromArticle } = require('lib/db')
const { extractUrls } = require('lib/crawler')
const { fetchHtml } = require('lib/fetch')
const { parseArticle } = require('lib/article')
const Package = require('package.json')

// Parsing URLs can be slow and sometimes even fail.
// The quickest way to crawl a large number can be to
// fetch the HTML and let the parsing happen later.
const PARSE_EXTRACTED_URLS = true

;(async () => {
  try {
    const db = await connect()
    
    console.log("MongoDB:", await mongoCount())

    const cursor = db.collection(MONGO_ARTICLE_COLLECTION).find().addCursorFlag('noCursorTimeout', true) // noCursorTimeout required for long running scripts
    
    while (cursor.hasNext()) {
      try {
        // Get each result and iterate over synchronously (exit while loop when no more results)
        const doc = await cursor.next().then(doc => doc).catch(e => null)
        if (doc === null) break

        // Skip articles that don't have a URL for some reason
        if (!doc.url) continue

        console.log(`> Extracting URLs from ${doc.url}`)

        const links = await extractUrls({ url: doc.url, html: doc.html, filterBySameDomain: true })

        for (const link of links) {
          console.log(`  * Found ${link.url}`)
          try {
            if (await getArticle(link.url)) {
              console.log(`    * URL already crawled (skipping)`)
              continue
            }
            
            console.log(`    * Fetching HTML`)
            const html = await fetchHtml(link.url)
            
            if (PARSE_EXTRACTED_URLS) {
              console.log(`    * Parsing HTML`)
              let article = await parseArticle(link.url, html)
              
              article._crawler = {}
              article._crawler.updated = new Date()
              article._crawler.updated = article._crawler.created
              article._crawler.version = Package.version

              // Save new article object (totally replace old object, to ensure consistancy).
              await addArticle(article)
              console.log("    * Saved article")

              // Save quotes from from the article (uses helper method).
              await addQuotesFromArticle(article)
              console.log(`    * Saved ${article.quotes.length} quotes`)
            } else {
              // Add article to DB without parsing it
              await addArticle({ url: link.url, html })
              console.log("    * Saved HTML to database")
            }
          } catch (e) {
            console.error(`Error crawling URL ${link.url}`, e)
            continue
          }
        }

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