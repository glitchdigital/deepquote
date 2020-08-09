import Link from 'next/link'
import { NewsPaper, Calendar } from 'react-zondicons'

export default function quote({text, hash, source}) {
  return (
    <Link href={`/quote/[id]`} as={`/quote/${hash}`}>
      <a className='no-underline block w-full mb-4 pb-2 border-2 border-gray-200 hover:shadow-lg hover:border-gray-300 text-gray-700 hover:text-gray-900 relative text-left rounded-lg bg-white'>
        <div className='mb-10 pb-5'>
          <p className='w-full pt-4 px-4 uppercase text-gray-600 font-extrabold'>
            <NewsPaper/>{source?.publisher || new URL(source?.url).hostname.replace(/^www\./, '')}
          </p>
          <h3 className='flex text-center p-2 px-4 text-justify font-serif'>
            <span className='hidden sm:flex leading-none font-bold text-gray-500 text-3xl'>&ldquo;</span>
            <span className='flex ml-2 mr-2 text-xl'>{text}</span>
            <span className='hidden sm:flex leading-none font-bold text-gray-500 text-3xl'>&rdquo;</span>
          </h3>
        </div>
        <p className='px-4 py-3 bg-gray-100 text-gray-600 font-bold rounded-b-lg absolute bottom-0 w-full'>
          <Calendar/>{new Date(source?.datePublished).toISOString().substring(0, 10)}
        </p>
      </a>
    </Link>
  )
}