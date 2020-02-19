import classname from 'classname'
import { useFetch } from 'components/fetch-hook';
import Head from '../../components/head'
import Nav from '../../components/nav'
import Citation from '../../components/citation'

const Page = ({query}) => {
  const { fuzzy } = query
  const [quote, loading] = useFetch(`/api/quote?id=${encodeURIComponent(query.id)}&fuzzy=${fuzzy}`)

  return (
    <>
      <Head title={loading ? "Loading…" : `"${quote?.text}"`} />
      <Nav />
      {!loading &&
        <div className="bg-gray-100 pt-5 md:pt-10 pb-5 border-b">
          <div className="relative m-auto pl-4 pr-4 md:p-0" style={{maxWidth: 800}}>
            <div className="relative rounded-lg bg-gray-300 z-30">
              <h2 className="flex font-serif text-justify mb-10 text-2xl flex px-4 py-6">
                <span className="hidden sm:flex leading-none font-bold text-gray-500 text-5xl mr-2">&ldquo;</span>
                <span className="flex m-auto text-gray-800">{quote?.text}</span>
                <span className="hidden sm:flex leading-none font-bold text-gray-500 text-5xl ml-2">&rdquo;</span>
              </h2>
              <div className="absolute right-0 border-gray-400 text-sm rounded border shadow-sm" style={{bottom: '-40px'}}>
                <a href={`/quote/${encodeURIComponent(quote.hash)}?fuzzy=false`} className={classname("text-gray-600 inline-block no-underline hover:underline rounded-l px-2 py-1 hover:bg-white", { 'font-semibold bg-gray-200 hover:bg-gray-200 text-gray-700 shadow-inner': !fuzzy || fuzzy === 'false' })}>Exact matches</a>
                <a href={`/quote/${encodeURIComponent(quote.hash)}?fuzzy=true`} className={classname("text-gray-600 inline-block no-underline hover:underline rounded-r px-2 py-1 hover:bg-white", { 'font-semibold bg-gray-200 hover:bg-gray-200 text-gray-700 shadow-inner': fuzzy && fuzzy !== 'false' })}>Show all</a>
              </div>
            </div>
            <div className="relative pt-2">
              <div className="absolute flex border-l-4 border-gray-400 border-dotted z-10" style={{
                  width: '10px',
                  top: -40,
                  bottom: 0,
                  left: 48,
                }}/>
              <div className="absolute w-full bg-gray-100 z-20" style={{
                  bottom: 0,
                  height: 140,
                }}/>
              {quote.citations.map((citation, i) =>
                <Citation {...citation} position={i+1}/>
              )}
            </div>
          </div>
        </div>
      }
    </>
  )
}

Page.getInitialProps = ({query}) => {
  return { query };
}

export default Page
