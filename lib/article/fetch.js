const fetch = require('isomorphic-fetch')

function fetchArticle(url) {
  return new Promise(async (resolve, reject) => {
    try {
        const fetchRes = await fetch(url)
        const html = await fetchRes.text()
        resolve(html)
    } catch (e) {
      console.error(`Error fetching URL ${url}`, e)
      reject(e)
    }
  })
}

module.exports = {
  fetchArticle
}