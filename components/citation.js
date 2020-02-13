import { Calendar, Link } from 'react-zondicons'

export default ({headline, source}) => (
  <div class="flex mb-5 sm:mb-10">
    <div style={{width: 100}} className="hidden sm:block">
      <div style={{height: 40, width: 40}} className="mt-5 m-auto bg-white border-4 rounded-full"/>
    </div>
    <div className="flex-auto">
      <div className="bg-gray-100 hover:bg-white w-full text-left inline-block transition-shadow duration-300 ease-in-out border shadow-md sm:shadow-lg hover:shadow-xl rounded-lg">
        <div className="pt-4 pl-4 pr-4">
          <span className="uppercase text-gray-500 font-bold">{source}</span>
          <p className="text-xl font-light mb-3">{headline}</p>
        </div>
        <p className="pl-4 pr-4 pt-2 pb-2 bg-gray-200">
          <span className="text-gray-600"><Calendar/>YYYY-MM-DD</span>
          <span className="text-gray-600 float-right underline"><Link/>example.com</span>
        </p>
      </div>
    </div>
  </div>
)