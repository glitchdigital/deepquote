import { Calendar, Link, Tag, NewsPaper } from 'react-zondicons'
import classname from 'classname'

const MAX_TAGS = 5

export default function timelineCitation({url, name, publisher, datePublished, suggestedResult, keywords, position}) {
  return (
    <>
      <div style={{width: 100}} className='z-30 flex-none hidden sm:block'>
        <div style={{height: 50, width: 50}} className={classname('mt-5 m-auto border-4 rounded-full text-center pt-2 text-lg font-bold border-gray-400', suggestedResult ? 'bg-white text-gray-600' : 'bg-gray-400 text-gray-700')}>
          {position}
        </div>
      </div>
      <div className='z-30 flex-grow'>
        <div className={classname('w-full text-left inline-block bg-white rounded-lg border-2', { 'bg-white shadow-xl border-2 border-gray-400': !suggestedResult })}>
          {!suggestedResult && <span className={'absolute top-0 right-0 px-2 py-1 bg-gray-300 text-gray-800 font-bold rounded-bl rounded-tr text-sm'}>Exact match</span>}
          <p className='pt-3 px-4 uppercase text-gray-600 font-extrabold'>
            <NewsPaper/>{publisher || new URL(url).hostname.replace(/^www\./, '')}
          </p>
          <a href={url} target='_blank' rel='noopener' className='text-gray-800 hover:text-blue-500 no-underline hover:underline block px-4 mb-2'>
            <span className='text-lg block text-xl font-semibold mt-2 mb-3'>{name}</span>
          </a>
          {keywords &&
            <p className='px-4 mb-1 font-semibold text-gray-700'>
              <Tag/>
              {keywords.slice(0, MAX_TAGS).map((keyword,i) => 
                <span key={`keyword:"${keyword}"`} className='inline-block mr-2 mb-2 px-3 py-1 rounded-full bg-gray-200 text-sm'>{keyword}</span>
              )}
            </p>
          }
          <p className='px-4 py-3 bg-gray-100 font-bold text-gray-600 rounded-b-lg'>
            <Calendar/>{new Date(datePublished).toISOString().substring(0, 10)}
            <a className='float-right no-underline hover:underline' href={url} target='_blank' rel='noopener'>
              <Link/>{new URL(url).hostname.replace(/^www\./, '')}
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
