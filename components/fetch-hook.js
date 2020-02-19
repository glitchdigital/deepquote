import 'isomorphic-fetch'
import { useState, useEffect } from 'react'

// Synchronous fetch method, useful for Server Side Rendering
const useFetchSync = async (url) => {
  const hostname = (typeof window !== 'undefined') ? window.location.protocol : process.env.API_HOSTNAME || 'http://localhost:3000'
  console.log("HOSTNAME MO", hostname)
  const response = await fetch(`${hostname}${url}`)  
  const json = await response.json()
  return json
}

// Hook for making calls to fetch
const useFetch = (url) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const fetchUrl = async () => {
    const response = await fetch(`${window.location.protocol}${url}`)
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
  useFetchSync
 }