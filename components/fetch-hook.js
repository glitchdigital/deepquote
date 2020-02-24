import 'isomorphic-fetch'
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

// Hook for making calls to fetch
const useFetch = (url) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const fetchUrl = async () => {
    const response = await fetch(`${HOSTNAME}${url}`)
    const json = await response.json()
    setData(json)
    setLoading(false)
  }
  useEffect(() => {
    fetchUrl()
  }, [])
  return [data, loading]
}

export { 
  useFetch,
  useFetchSync,
  HOSTNAME
 }