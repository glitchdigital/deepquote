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
      <div className="grid md:grid-cols-3 pl-2 pr-2 mb-2">
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
