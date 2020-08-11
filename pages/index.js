import { Trans } from '@lingui/macro'

import { DEFAULT_CACHE_CONTROL_HEADER }  from 'lib/cache-control'
import Head from 'components/head'
import Nav from 'components/nav'
import QuoteCard from 'components/cards/quote'
import { useFetch, useFetchSync, HOSTNAME } from 'components/fetch-hook'
import Spinner from 'components/spinner'
import { version } from 'package.json'

const QUOTES_API_ENDPOINT = '/api/quotes'

const Page = (props) => {
  const { pageUrl } = props
  const [ quotes, loading ] = useFetch(QUOTES_API_ENDPOINT, props.quotes)

  return (
    <>
      <Head title='DeepQuote' url={pageUrl}/>
      <Nav/>
      <div className='pt-10 pb-10 text-center relative'>
        <div className='hero'>
          <h1 className='mb-2 mt-20 mx-2 text-gray-800 leading-tight text-5xl font-semibold'>DeepQuote</h1>
          <p className='text-gray-700 mb-20'>Find the earliest evidence of a quote</p>
        </div>
      </div>
      <div className='relative pt-2 pb-0 overflow-auto' style={{minHeight: 100}}>
        <div className="block absolute w-full bottom-0 z-10"
          style={{
            pointerEvents: 'none',
            height: 200,
            backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(247, 250, 252, 1))'
          }}
        />
        <div className='m-auto w-full max-w-screen-xl px-2 py-4 lg:px-2 lg:py-2'>
          {loading && <Spinner className='mt-5'/>}
          {splitArrayIntoParts(quotes, 3).map((column,i) => 
            <div key={`quote-column-${i}`} className='inline-block lg:w-1/3 block p-0 lg:p-2 px-2 float-left overflow-hidden max-h-full lg:max-h-screen'>
              {column.map((quote) => <QuoteCard key={quote.hash} {...quote}/> )}
            </div>
          )}
        </div>
      </div>
      <p className="text-gray-800 text-center px-4 py-8">
        <Trans id="app_version"/> {version}
      </p>
    </>
  )
}

Page.getInitialProps = async ({res}) => {
  let quotes

  if (res) {
    // When Server Side Rendering, set cache headers and fetch quotes from API
    // before rendering as React hooks don't work when rendering server side
    res.setHeader('Cache-Control', DEFAULT_CACHE_CONTROL_HEADER)
    quotes = await useFetchSync(QUOTES_API_ENDPOINT)
  }

  return {
    quotes,
    pageUrl: HOSTNAME
  }
}

// @FIXME Not performant, but is practical given the array is fairly small
function splitArrayIntoParts(inputArray, numberOfParts) {
  const copyOfInputArray = inputArray ? JSON.parse(JSON.stringify(inputArray)) : []
  let result = [];
  for (let i = numberOfParts; i > 0; i--) {
      result.push(copyOfInputArray.splice(0, Math.ceil(copyOfInputArray.length / i)))
  }
  return result
}

export default Page
