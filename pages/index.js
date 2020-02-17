import Head from 'components/head'
import Nav from 'components/nav'
import Quote from 'components/quote';
import { useFetch } from 'components/hooks';

const Page = () => {
  const [quotes, loading] = useFetch('/api/quotes')
  
  return (
    <>
      <Head title="Did They Really Say That?" />
      <Nav />
      <div className="pt-20 pb-20 text-center">
        <h1 className="mb-2 mt-10 text-4xl md:text-6xl font-serif">Did they really say that?</h1>
        <p className="text-lg md:text-2xl text-gray-600 font-normal mb-10">description description description description</p>
      </div>
      <div className="mt-5 grid lg:grid-cols-3 pl-2 pr-2 mb-2 bg-gray-100 border-t pt-2">
        {quotes.map((quote) => <Quote {...quote}/> )}
      </div>
    </>
  )
}

Page.getInitialProps = ({query}) => {
  return { query };
}

export default Page
