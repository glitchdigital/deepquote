import Head from 'components/head'
import Nav from 'components/nav'
import QuoteCard from 'components/cards/quote'
import { useFetch, useFetchSync, HOSTNAME } from 'components/fetch-hook'
import { version } from 'package.json'

const QUOTES_API_ENDPOINT = '/api/quotes'

const Page = (props) => {
  const { url } = props
  let quotes = props.quotes

  // If we don't have quotes in a prop (as Client Side Rendering)
  // then we need to fetch them client side using a React hook
  if (!quotes) {
    const [ data, loading ] = useFetch(QUOTES_API_ENDPOINT)
    if (!loading) quotes = data
  }

  return (
    <>
      <Head title='Did They Really Say That?' url={url}/>
      <Nav />
      <div className='pt-20 pb-20 text-center'>
        <h1 className='mb-2 mt-10 mx-2 leading-tight text-5xl lg:text-6xl font-bold'>Did they really say that?</h1>
        <p className='text-lg md:text-3xl text-gray-600 mb-10 font-semibold'>Find the earliest evidence of a quote</p>
      </div>
      <div className='mt-4 grid lg:grid-cols-3 pl-2 pr-2 mb-2 bg-gray-100 border-t pt-2' style={{minHeight: '500px'}}>
        {quotes?.map((quote) => <QuoteCard key={quote.hash} {...quote}/> )}
      </div>
      <div className="mt-4">
        <hr/>
        <p className="text-sm text-gray-800 text-center p-4">
          Version {version}
        </p>
      </div>
    </>
  )
}

Page.getInitialProps = async ({res}) => {
  let quotes

  if (res) {
    // When Server Side Rendering, set cache headers and fetch quotes from API
    // before rendering as React hooks don't work when rendering server side
    res.setHeader('Cache-Control', `public,max-age=60,s-maxage=${60 * 60}`)
    quotes = await useFetchSync(QUOTES_API_ENDPOINT)
  }

  return {
    quotes,
    url: HOSTNAME
  }
}

export default Page
