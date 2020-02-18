import { Calendar, Link, Tag, NewsPaper } from 'react-zondicons'

const MAX_TAGS = 5

export default ({name, publisher, datePublished, url, keywords, position}) => (
  <div className="flex mb-5 sm:mb-10 z-20 relative">
    <div style={{width: 100}} className="flex-none hidden sm:block">
      <div style={{height: 50, width: 50}} className="mt-5 m-auto bg-white border-4 border-gray-400 rounded-full text-center pt-2 text-gray-400 text-lg font-semibold">
        {position}
      </div>
    </div>
    <div className="flex-grow">
      <div className="w-full text-left inline-block bg-white shadow-lg rounded-lg">
        <p className="pt-3 px-4 -block uppercase text-gray-500 font-semibold"><NewsPaper/>{publisher || new URL(url).hostname.replace(/^www\./, '')}</p>
        <a href={url} target="_blank" className="text-gray-800 hover:text-blue-500 no-underline hover:underline block px-4 mb-2">
          <span className="text-lg block text-md font-semibold mt-2 mb-3">{name}</span>
        </a>
        {keywords &&
          <p className="px-4 mb-3 text-gray-600">
            <Tag/>
            {keywords.slice(0, MAX_TAGS).map((keyword,i) => 
              <span className="mr-1">{keyword}{i === (keyword.length-1) || i === (MAX_TAGS-1) ? '' : ','}</span>
            )}
          </p>
        }
        <p className="px-4 pt-2 pb-2 bg-gray-100 text-gray-600 rounded-b-lg">
          <Calendar className="ml-2"/>{new Date(datePublished).toLocaleDateString()}
          <a className="float-right no-underline hover:underline" href={url} target="_blank"><Link/>{new URL(url).hostname.replace(/^www\./, '')}</a>
        </p>
      </div>
    </div>
  </div>
)
