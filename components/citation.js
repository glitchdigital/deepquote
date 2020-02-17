import { Calendar, Link, Tag, NewsPaper } from 'react-zondicons'

export default ({headline, source, domain, tags, position}) => (
  <div className="flex mb-5 sm:mb-10 z-20 relative">
    <div style={{width: 100}} className="flex-none hidden sm:block">
      <div style={{height: 50, width: 50}} className="mt-5 m-auto bg-white border-4 border-gray-400 rounded-full text-center pt-2 text-gray-400 text-lg font-semibold">
        {position}
      </div>
    </div>
    <div className="flex-grow">
      <div className="w-full text-left inline-block bg-white shadow-lg rounded-lg">
        <div className="pt-4 px-4 mb-2">
          <span className="uppercase text-gray-500 font-semibold"><NewsPaper/>{source}</span>
          <p className="text-md font-semibold mt-2 mb-3">{headline}</p>
        </div>
        {tags &&
          <p className="px-4 mb-3 text-gray-600">
            <Tag/>
            {tags.map((tag,i) => 
              <span className="mr-1">{tag}{i === (tags.length-1) ? '' : ','}</span>
            )}
          </p>
        }
        <p className="px-4 pt-2 pb-2 bg-gray-100 text-gray-600 rounded-b-lg">
          <span><Calendar/>YYYY-MM-DD</span>
          <a className="float-right no-underline hover:underline" href="#"><Link/>{domain}</a>
        </p>
      </div>
    </div>
  </div>
)
