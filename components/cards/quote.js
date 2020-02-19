import { NewsPaper, Calendar, NavigationMore } from 'react-zondicons'

export default ({text, hash, source}) => (
  <div className='shadow-lg inline-block relative text-left pb-5 rounded-lg bg-white m-2'>
    <a href={`/quote/${encodeURIComponent(hash)}`} className='mb-5 flex no-underline text-gray-800 hover:text-blue-500'>
      <h3 className='flex text-center p-4 pb-10 text-justify font-serif'>
        <span className='hidden sm:flex leading-none font-bold text-gray-500 text-3xl'>&ldquo;</span>
        <span className='flex ml-2 mr-2'>{text}</span>
        <span className='hidden sm:flex leading-none font-bold text-gray-500 text-3xl'>&rdquo;</span>
      </h3>
      <span className='absolute bottom-0 text-gray-600 text-right p-2 mb-10 text-sm w-full'>
        <NewsPaper/>{source?.publisher || new URL(source?.url).hostname.replace(/^www\./, '')}
      </span>
    </a>
    <p className='py-2 px-1 bg-gray-100 text-gray-600 rounded-b-lg absolute bottom-0 w-full'>
      <Calendar className='ml-2'/>{new Date(source?.datePublished).toLocaleDateString()}
      <a href={`/quote/${encodeURIComponent(hash)}`} className='float-right underline text-gray-600'><NavigationMore/></a>
    </p>
  </div>
)