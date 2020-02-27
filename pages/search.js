import { useState, useEffect} from 'react'

import { DEFAULT_CACHE_CONTROL_HEADER }  from 'lib/cache-control'
import { useFetchSync, HOSTNAME } from 'components/fetch-hook'
import Head from 'components/head'
import Nav from 'components/nav'
import SearchResult from 'components/search/result'
import Spinner from 'components/spinner'

const SEARCH_API_ENDPOINT = (searchText) => `/api/search?t=${encodeURIComponent(searchText)}`

const Page = (props) => {
  const { t: searchText = '', url } = props.query
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState(props.searchResults)

  useEffect(() => {
    (async () => {
      // Only fetch search results if they haven't been fetched already
      if (!props.searchResults) {
        setLoading(true)
        setSearchResults(await useFetchSync(SEARCH_API_ENDPOINT(searchText)))
        setLoading(false)
      }
    })()
  }, [searchText])

  return (
    <>
      <Head title="Search" url={url}/>
      <Nav defaultSearchText={searchText} />
      <div className='bg-gray-100 fixed top-0 w-full h-screen z-0'/>
      <div className='text-center py-5 xbg-white relative m-auto px-5 max-w-screen-lg px-5'>
        <h2 className='border-b-4 text-gray-600 mb-5 pb-4'>Search results</h2>
        {!searchText &&
          <p className='text-xl text-gray-600'>Enter words or a quote to search for.</p>
        }
        {loading &&
          <Spinner/>
        }
        {!loading && searchText && searchText.length > 0 && searchResults && searchResults.length === 0 && 
          <p className='text-xl text-gray-600'>No results for " <b>{searchText}</b> ".</p>
        }
        {!loading && searchResults && searchResults.map(searchResult => 
          <SearchResult key={searchResult.hash} {...searchResult}/>
        )}
      </div>
    </>
  )
}
Page.getInitialProps = async ({query, res}) => {
  const { t: searchText } = query
  let searchResults

  if (res) {
    // When Server Side Rendering, set cache headers and fetch quotes from API
    // before rendering as React hooks don't work when rendering server side
    res.setHeader('Cache-Control', DEFAULT_CACHE_CONTROL_HEADER)
    searchResults = await useFetchSync(SEARCH_API_ENDPOINT(searchText))
  }

  return {
    query,
    searchResults,
    url: `${HOSTNAME}/search`
  }
}

export default Page
