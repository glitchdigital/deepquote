import Link from 'next/link'
import classname from 'classname'
import { useFetch, useFetchSync, HOSTNAME } from 'components/fetch-hook'
import Head from 'components/head'
import Nav from 'components/nav'
import Quote from 'components/timeline/quote'
import Citation from 'components/timeline/citation'

const QUOTE_API_ENDPOINT = (id) => `/api/quote?id=${encodeURIComponent(id)}`

const Page = (props) => {
  const { id = null, showAll: showAllQueryParam, url } = props.query
  const showAll = (showAllQueryParam === 'true')
  let quote = props.quote

  // If we don't have a quote in a prop (as Client Side Rendering)
  // then we need to fetch it client side using a React hook
  if (!quote) {
    const [data, loading] = useFetch(QUOTE_API_ENDPOINT(id))
    if (!loading) quote = data
  }

  return (
    <>
      <Head title={`"${quote?.text}"`} url={url}/>
      <Nav />
      {quote &&
        <div className='bg-gray-100 pt-5 md:pt-10 pb-10 border-b'>
          <div className='relative m-auto pl-4 pr-4 md:p-0' style={{maxWidth: 800}}>
            <div className='relative rounded-lg bg-gray-300 z-30'>
              <Quote {...quote}/>
              <div className='absolute right-0 text-sm font-semibold rounded-full border shadow-sm' style={{bottom: '-50px'}}>
                <Link href={`/quote/[id]`} as={`/quote/${quote?.hash}`}>
                  <a className={classname('text-gray-600 inline-block no-underline hover:underline rounded-l-full px-4 py-2 hover:bg-white', { 'bg-gray-200 hover:bg-gray-200 text-gray-800 shadow-inner': !showAll })}>
                    Exact matches
                  </a>
                </Link>
                <Link href={`/quote/[id]?showAll=true`} as={`/quote/${quote?.hash}?showAll=true`}>
                  <a className={classname('text-gray-600 inline-block no-underline hover:underline rounded-r-full px-4 py-2 hover:bg-white', { 'bg-gray-200 hover:bg-gray-200 text-gray-800 shadow-inner': showAll })}>
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
      </div>
      }
    </>
  )
}
Page.getInitialProps = async ({query, res}) => {
  const { id } = query
  let quote

  if (res) {
    // When Server Side Rendering, set cache headers and fetch quotes from API
    // before rendering as React hooks don't work when rendering server side
    res.setHeader('Cache-Control', `public,max-age=60,s-maxage=${60 * 60}`)
    quote = await useFetchSync(QUOTE_API_ENDPOINT(id))
  }

  return {
    query,
    quote,
    url: `${HOSTNAME}/quote/${id}`
  }
}

export default Page
