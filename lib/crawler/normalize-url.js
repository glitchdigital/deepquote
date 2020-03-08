module.exports = (inputUrl, baseUrl = '') => {
  // Strip anchor text
  let url = inputUrl.replace(/#(.*)$/, '')
  
  // Strip the trailing slash from URLs (as long as they don't have query string)
  //
  // This may cause problems in some edge cases, but is helpful in the majority
  // of cases as query strings are much more likely to be used for things like
  // tracking than for serving unique pages.
  if (!url.includes('?'))
    url = url.replace(/\/$/, '')

  // If URL does not start with a protocol (or //:) then append base URL so the result
  // is an absolute link, rather than a relative one.
  //
  // There are edge cases where this approach may not be correct - such pages that use
  // the <base> tag - but works well in pratice on the vast majority of pages.
  if (!url.match(/[A-z]:/) && !url.startsWith('//:'))
    url = `${baseUrl}${url}`

  // Check URL formatting again
  // This catchs cases suchthe baseUrl not having a protocol on it or when a baseUrl
  // is not supplied. It assumes HTTPS protocol and does not check for a domain.
  if (url.startsWith('//:'))
    url = `https${url}`
  
  if (!url.match(/[A-z]:/)) 
    url = `https://${url}`

  return url
}