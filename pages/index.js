import { LoremIpsum } from "lorem-ipsum"
import Head from '../components/head'
import Nav from '../components/nav'
import { Time, NavigationMore,NewsPaper } from 'react-zondicons'

const lorem = new LoremIpsum({
  wordsPerSentence: {
    max: 24,
    min: 3
  }
})

const Quote = ({id, quote, date}) => (
  <div className="transition-all duration-300 ease-in-out hover:shadow-xl inline-block relative text-left rounded-lg bg-gray-200 hover:border-gray-300 border border-transparent hover:bg-white m-2">
      <h2 className="flex text-center p-4 mb-10 text-justify font-serif">
        <span className="hidden sm:flex leading-none font-bold text-gray-400 text-3xl">&ldquo;</span>
        <a href={`/timeline?id=${id}`} className="flex no-underline text-gray-600 ml-2 mr-2">
          <span className="flex text-gray-800">{quote}</span>
        </a>
        <span className="hidden sm:flex leading-none font-bold text-gray-400 text-3xl">&rdquo;</span>
      </h2>
      <p className="p-2 bg-gray-300 text-gray-600 absolute bottom-0 w-full">
        <NewsPaper className="ml-2"/><span className="bg-gray-600 text-sm text-white rounded-full p-1 pl-2 pr-2">{Math.floor(Math.random() * 10) + 1}</span>
        <a href={`/timeline?id=${id}`} className="float-right underline text-gray-600"><NavigationMore/></a>
      </p>
  </div>
)

export default () => {
  const quotes = Array.from({length: 24}).map(() => ({
    id: Math.floor(Math.random() * 1000) + 1,
    quote: lorem.generateSentences(1),
    date: 'YYYY-DD-MM'
  }))
  return (
    <>
      <Head title="Did They Really Say That?" />
      <Nav />
      <div className="grid md:grid-cols-3 pl-2 pr-2 mb-2">
        {quotes.map((quote) =>
          <Quote {...quote}/>
        )}
      </div>
    </>
  )
  }
