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
      <div className="pt-5 pb-5">
        <h1 className="text-center mb-2 mt-10">Did they really say that?</h1>
        <p className="text-center text-lg text-gray-500 font-normal mb-10">description description description description</p>
      </div>
      <div className="mt-5 grid md:grid-cols-3 pl-2 pr-2 mb-2">
        {quotes.map((quote) => <Quote {...quote}/> )}
      </div>
    </>
  )
}


// Page.getInitialProps = (ctx) => {
//   const { data } = useData();
//   return { data };
// }


export default Page
