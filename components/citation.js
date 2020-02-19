import { Calendar, Link, Tag, NewsPaper } from 'react-zondicons'
import classname from 'classname'

const MAX_TAGS = 5

export default ({url, name, publisher, datePublished, exactMatch, keywords, position}) => (
  <div className='flex mb-5 sm:mb-10 z-20 relative'>
    <div style={{width: 100}} className='flex-none hidden sm:block'>
      <div style={{height: 50, width: 50}} className={classname('mt-5 m-auto border-4 rounded-full text-center pt-2 text-lg font-semibold', exactMatch ? 'bg-white border-gray-400 shadow-lg text-gray-600' : 'border-gray-300 bg-gray-100 text-gray-500')}>
        {position}
      </div>
    </div>
    <div className='flex-grow'>
      <div className={classname('w-full text-left inline-block bg-white rounded-lg border-2', { 'bg-white shadow-xl border-2 border-gray-400': exactMatch })}>
        <p className='pt-3 px-4 -block uppercase text-gray-500 font-semibold'>
          <NewsPaper/>{publisher || new URL(url).hostname.replace(/^www\./, '')}
        </p>
        <a href={url} target='_blank' className='text-gray-800 hover:text-blue-500 no-underline hover:underline block px-4 mb-2'>
          <span className='text-lg block text-md font-semibold mt-2 mb-3'>{name}</span>
        </a>
        {keywords &&
          <p className='px-4 mb-3 text-gray-600'>
            <Tag/>
            {keywords.slice(0, MAX_TAGS).map((keyword,i) => 
              <span className='inline-block mr-2 mb-1 px-2 py-1 rounded-full bg-gray-200 text-sm'>{keyword}</span>
            )}
          </p>
        }
        <p className='px-4 pt-2 pb-2 bg-gray-100 text-gray-600 rounded-b-lg'>
          <Calendar className='ml-2'/>{new Date(datePublished).toLocaleDateString()}
          <a className='float-right no-underline hover:underline' href={url} target='_blank'>
            <Link/>{new URL(url).hostname.replace(/^www\./, '')}
          </a>
        </p>
      </div>
    </div>
  </div>
)
