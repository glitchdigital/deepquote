import { useState, useEffect } from 'react'

// Use the hostname set by an environment variable for API calls
// (with default value of 'http://localhost:3000' for local development).
// It's also possible to get the hostname from the request header, but would be less secure.
const HOSTNAME = (typeof window !== 'undefined') ? `${window.location.protocol}//${window.location.host}` : process.env.APP_HOSTNAME || 'http://localhost:3000'

// Synchronous fetch method, useful for Server Side Rendering
const useFetchSync = async (url) => {
  const response = await fetch(`${HOSTNAME}${url}`)
  const json = await response.json()
  return json
}

// Hook for making calls to fetch to get data
const useFetch = (path, defaultValue = null, force = false) => {
  // Use defaultValue for initial data and set loading to false
  // if a defaultValue is specified.
  //
  // The defaultValue option is useful to pass directly from props
  // in cases where a Server Side Render may mean we already have
  // the data and don't actually need to make a fetch request.
  const [data, setData] = useState(defaultValue)
  const [loading, setLoading] = useState(!defaultValue)
  // Fetch URL - called from useEffect()
  const fetchUrl = async (url) => {
    const response = await fetch(url)
    const json = await response.json()
    setData(json)
    setLoading(false)
  }
  // Use effect is triggered anytime the path changes.
  // This makes it easy to write a hook that requests
  // data by ID or keywords in a query string, and that
  // only actually makes a fetch request when needed.
  useEffect(() => {
    // Only call fetch if there is no defaultValue or
    // force is set to true.
    if (force || !defaultValue) fetchUrl(`${HOSTNAME}${path}`)
  }, [path])
  return [data, loading]
}

export { 
  useFetch,
  useFetchSync,
  HOSTNAME
 }