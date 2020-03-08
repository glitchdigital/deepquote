const urlParser = require('url')
const JSDOM = require('jsdom').JSDOM

const { fetchHtml } = require('lib/fetch')
const normalizeUrl = require('lib/crawler/normalize-url')

module.exports = async ({
  url,
  html: _html,
  filterBySameDomain = false,
  fetch = { options: {} }
} = {}) => {
  let html = _html

  // If HTML is not supplied then fetch page
  if (!html)
    html = await fetchHtml(url)

  const urlParts = urlParser.parse(url)
  const domain = urlParts.hostname
  const baseUrl = `${urlParts.protocol}//${urlParts.host}`

  const dom = new JSDOM(html, { url })
  let links = []
  dom.window.document.querySelectorAll('a').forEach(node => {
    let linkUrl = node.getAttribute('href') || ''

    if (linkUrl.startsWith('javascript:'))
      return

    linkUrl = normalizeUrl(linkUrl, baseUrl)

    links.push({
      url: linkUrl,
      text: node.textContent.replace('\n', '').trim() || '',
      domain: urlParts.parse(linkUrl).hostname
    })
  })

  // Remove duplicate URLs
  links = links.filter((link, pos, arr) => arr.map(mapObj => mapObj['url']).indexOf(link['url']) === pos)

  // Apply filter by domain (if option is set)
  if (filterBySameDomain)
    links = links.filter(link => link.domain == domain)

  return Promise.resolve(links)
}