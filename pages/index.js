import Head from 'components/head'
import Nav from 'components/nav'
import QuoteCard from 'components/cards/quote'
import { useFetch, useFetchSync, getHostname } from 'components/fetch-hook'

const QUOTES_API_ENDPOINT = '/api/quotes'

const Page = (props) => {
  const { url } = props
  let [ data, loading ] = useFetch(QUOTES_API_ENDPOINT)
  
  // Use server side render provided data while client is fetching latest version
  const quotes = loading ? props.data : data

  return (
    <>
      <Head title='Did They Really Say That?' url={url}/>
      <Nav />
      <div className='pt-20 pb-20 text-center'>
        <h1 className='mb-2 mt-10 text-4xl md:text-6xl font-serif'>Did they really say that?</h1>
        <p className='text-lg md:text-2xl text-gray-600 font-normal mb-10'>description description description description</p>
      </div>
      <div className='mt-5 grid lg:grid-cols-3 pl-2 pr-2 mb-2 bg-gray-100 border-t pt-2' style={{minHeight: '500px'}}>
        {quotes.map((quote) => <QuoteCard key={quote.hash} {...quote}/> )}
      </div>
    </>
  )
}

Page.getInitialProps = async ({query, res}) => {
  const data = await useFetchSync(QUOTES_API_ENDPOINT)

  res.setHeader('Cache-Control', `public,max-age=60,s-maxage=${60 * 60}`)

  return {
    ...query,
    data,
    url: getHostname(),
    loading: true
  }
}

export default Page
