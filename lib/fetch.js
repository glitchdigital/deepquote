const fetch = require('isomorphic-fetch')
const UserAgent = require('user-agents')

function fetchHtml(url) {
  return new Promise(async (resolve, reject) => {
    try {
        const userAgent = new UserAgent().toString()
        const fetchRes = await fetch(url, { headers: { 'User-Agent': userAgent } })
        const html = await fetchRes.text()
        resolve(html)
    } catch (e) {
      console.error(`Error fetching URL ${url}`, e)
      reject(e)
    }
  })
}

module.exports = {
  fetchHtml
}