import Link from 'next/link'
import classname from 'classname'

import { DEFAULT_CACHE_CONTROL_HEADER }  from 'lib/cache-control'
import { useFetch, useFetchSync, HOSTNAME } from 'components/fetch-hook'
import Head from 'components/head'
import Nav from 'components/nav'
import Quote from 'components/timeline/quote'
import Citation from 'components/timeline/citation'
import Spinner from 'components/spinner'

const QUOTE_API_ENDPOINT = (id) => `/api/quote?id=${encodeURIComponent(id)}`

const Page = (props) => {
  const { id = null, showAll: showAllQueryParam, url } = props.query
  const showAll = (showAllQueryParam === 'true')
  const [ quote, loading ] = useFetch(QUOTE_API_ENDPOINT(id), props.quote)

  return (
    <>
      <Head title={quote?.text ? `"${quote.text}"` : 'Quote'} url={url}/>
      <Nav />
      <div className='bg-gray-100 fixed top-0 w-full h-screen z-0'/>
      <div className='pt-5 sm:pt-10 relative'>
        {loading && <Spinner/>}
        <div className={classname('transition-all ease-in-out duration-100', quote ? 'opacity-1' : 'opacity-0')}>
          {!loading &&
            <div className='relative m-auto px-5 max-w-screen-md'>
              <div className='relative rounded-lg bg-gray-300 z-30'>
                <Quote {...quote}/>
                <div className='absolute right-0 text-sm font-semibold rounded-full border shadow-sm' style={{bottom: '-50px'}}>
                  <Link href={`/quote/[id]`} as={`/quote/${quote?.hash}`}>
                    <a className={classname('text-gray-600 inline-block no-underline hover:underline rounded-l-full px-4 py-2 hover:bg-white bg-gray-100', { 'bg-gray-200 hover:bg-gray-200 text-gray-800 shadow-inner': !showAll })}>
                      Exact matches
                    </a>
                  </Link>
                  <Link href={`/quote/[id]?showAll=true`} as={`/quote/${quote?.hash}?showAll=true`}>
                    <a className={classname('text-gray-600 inline-block no-underline hover:underline rounded-r-full px-4 py-2 hover:bg-white bg-gray-100', { 'bg-gray-200 hover:bg-gray-200 text-gray-800 shadow-inner': showAll })}>
                      Possible matches
                    </a>
                  </Link>
                </div>
              </div>
              <div className='relative pt-6'>
                <div className='absolute flex z-10' style={{
                    width: '10px',
                    top: -40,
                    bottom: 0,
                    left: 48,
                    borderWidth: '0 0 0 5px'
                  }}/>
                <div className='absolute w-full bg-gray-100 z-20' style={{
                    bottom: 0,
                    height: 140,
                  }}/>
                {quote?.citations?.filter((citation) => (showAll || !citation.suggestedResult)).map((citation, i) =>
                  <Citation key={citation.url} {...citation} position={i+1}/>
                )}
              </div>
            </div>
            }
        </div>
      </div>
    </>
  )
}
Page.getInitialProps = async ({query, res}) => {
  const { id } = query
  let quote

  if (res) {
    // When Server Side Rendering, set cache headers and fetch quotes from API
    // before rendering as React hooks don't work when rendering server side
    res.setHeader('Cache-Control', DEFAULT_CACHE_CONTROL_HEADER)
    quote = await useFetchSync(QUOTE_API_ENDPOINT(id))
  }

  return {
    query,
    quote,
    url: `${HOSTNAME}/quote/${id}`
  }
}

export default Page
