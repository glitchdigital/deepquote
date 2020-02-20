import { useFetch, useFetchSync, getHostname } from 'components/fetch-hook'
import Head from 'components/head'
import Nav from 'components/nav'
import Quote from 'components/timeline/quote'
import Citation from 'components/timeline/citation'

const QUOTE_API_ENDPOINT = ({id, fuzzy}) => `/api/quote?id=${encodeURIComponent(id)}&fuzzy=${encodeURIComponent(fuzzy)}`

const Page = (props) => {
  const { id = null, showAll = false, url } = props.query
  const [data, loading] = useFetch(QUOTE_API_ENDPOINT({id, showAll}))

  // Use server side render provided data while client is fetching latest version
  const quote = loading ? props.data : data

  return (
    <>
      <Head title={`"${quote.text}"`} url={url}/>
      <Nav />
      <div className='bg-gray-100 pt-5 md:pt-10 pb-5 border-b'>
        <div className='relative m-auto pl-4 pr-4 md:p-0' style={{maxWidth: 800}}>
          <Quote {...quote} showAll={showAll}/>
          <div className='relative pt-6'>
            <div className='absolute flex border-l-4 z-10' style={{
                width: '10px',
                top: -40,
                bottom: 0,
                left: 49,
              }}/>
            <div className='absolute w-full bg-gray-100 z-20' style={{
                bottom: 0,
                height: 140,
              }}/>
            {quote.citations.map((citation, i) =>
              <Citation key={citation.url} {...citation} position={i+1}/>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

Page.getInitialProps = async ({query, res}) => {
  const { id, showAll } = query
  const data = await useFetchSync(QUOTE_API_ENDPOINT({id, showAll}))

  if (res) res.setHeader('Cache-Control', `public,max-age=60,s-maxage=${60 * 60}`)

  return {
    query,
    data,
    url: `${getHostname()}/quote/${id}`,
    loading: true
  }
}

export default Page
