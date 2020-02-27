import { useState, useEffect} from 'react'
import { Trans } from '@lingui/macro'

import { DEFAULT_CACHE_CONTROL_HEADER }  from 'lib/cache-control'
import Head from 'components/head'
import Nav from 'components/nav'
import QuoteCard from 'components/cards/quote'
import { useFetchSync, HOSTNAME } from 'components/fetch-hook'
import Spinner from 'components/spinner'
import { version } from 'package.json'

const QUOTES_API_ENDPOINT = '/api/quotes'

const Page = (props) => {
  const { url } = props
  const [quotes, setQuotes] = useState(props.quotes)

  useEffect(() => {
    (async () => {
      // Only fetch quote if it hasn't been fetched already
      if (!quotes)
        setQuotes((await useFetchSync(QUOTES_API_ENDPOINT)))
    })()
  }, [])

  return (
    <>
      <Head title='Did They Really Say That?' url={url}/>
      <Nav />
      <div className='pt-20 pb-20 text-center'>
        <h1 className='mb-2 mt-10 mx-2 leading-tight text-5xl lg:text-6xl font-bold'>Did they really say that?</h1>
        <p className='text-lg md:text-3xl text-gray-600 mb-10 font-semibold'>Find the earliest evidence of a quote</p>
      </div>
      <div className='relative mt-4 bg-gray-100 border-t pb-0 overflow-auto' style={{minHeight: 100}}>
        <div className="block absolute w-full bottom-0 z-10"
          style={{
            height: 100,
            backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))'
          }}
        />
        <div className='m-auto w-full max-w-screen-xl px-2 py-4 lg:px-2 lg:py-2'>
          {!quotes && <Spinner/>}
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
    url: HOSTNAME
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
