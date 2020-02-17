import { Time, NavigationMore } from 'react-zondicons'

export default ({id, quote, quoteHash, date}) => (
  <div className="shadow-lg  inline-block relative text-left rounded-lg bg-white m-2">
      <h3 className="flex text-center p-4 mb-10 text-justify font-serif">
        <span className="hidden sm:flex leading-none font-bold text-gray-400 text-3xl">&ldquo;</span>
        <a href={`/quote/${encodeURIComponent(quoteHash)}`} className="flex no-underline text-gray-600 ml-2 mr-2">
          <span className="flex text-gray-800">{quote}</span>
        </a>
        <span className="hidden sm:flex leading-none font-bold text-gray-400 text-3xl">&rdquo;</span>
      </h3>
      <p className="p-2 bg-gray-100 text-gray-600 rounded-b-lg absolute bottom-0 w-full">
        <Time className="ml-2"/>{date.split(' ')[0]}
        <a href={`/quote/${encodeURIComponent(quoteHash)}`} className="float-right underline text-gray-600"><NavigationMore/></a>
      </p>
  </div>
)