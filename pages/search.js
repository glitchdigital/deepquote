import { useState, useEffect } from 'react'

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

  // We use our own useEffect() routine here, instead of using the useFetch hook
  // we use for other components. This is because of the special case this page
  // has of being passed text down as a query string and wanting search results
  // and the search text on screen to always match up and not be subject to 
  // flickering or being out of sync due to their states updating asynchronously.
  useEffect(() => {
    (async () => {
      // Only fetch search results if they haven't already been passed in
      // props from a Server Side Render. This is to avoid fetching the same
      // data on Client Side Render immediately after rendering server side.
      if (!props.searchResults) {
        // Edge case: Bail early if the search text is empty (avoids flicker).
        if (searchText.trim().length === 0)
          return setSearchResults([])

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
      <div className='text-center py-5 relative m-auto px-5 max-w-screen-md px-5'>
        {!loading && searchText.length > 0 && searchResults && searchResults.length === 0 && 
          <p className='text-xl text-gray-600'>No search results for "<b>{searchText}</b>"</p>
        }
        {!loading && searchResults && searchResults.length > 0 &&
          <p className='text-xl text-gray-600'>Search results for "<b>{searchText}</b>"</p>
        }
        {loading && searchText &&
          <p className='text-xl text-gray-600'>Searching for "<b>{searchText}</b>"</p>
        }
        {!loading && !searchText &&
          <p className='text-xl text-gray-600'>Enter a quote or to search for.</p>
        }
        {(loading || searchText.length > 0) &&
          <hr className='mt-5 mb-5 border-2'/>
        }
        {loading &&
          <Spinner/>
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
