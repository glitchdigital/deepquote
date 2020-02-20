import classname from 'classname'

export default ({text, hash, showAll}) => (
  <div className='relative rounded-lg bg-gray-300 z-30'>
    <h2 className='flex font-serif text-justify mb-10 text-2xl flex px-4 py-6'>
      <span className='hidden sm:flex leading-none font-bold text-gray-500 text-5xl mr-2'>&ldquo;</span>
      <span className='flex m-auto text-gray-800'>{text}</span>
      <span className='hidden sm:flex leading-none font-bold text-gray-500 text-5xl ml-2'>&rdquo;</span>
    </h2>
    <div className='absolute right-0 text-sm rounded-full border shadow-sm' style={{bottom: '-50px'}}>
      <a href={`/quote/${encodeURIComponent(hash)}?showAll=false`} className={classname('text-gray-600 inline-block no-underline hover:underline rounded-l-full px-4 py-2 hover:bg-white', { 'font-semibold bg-gray-200 hover:bg-gray-200 text-gray-700 shadow-inner': !showAll || showAll === 'false' })}>Exact matches</a>
      <a href={`/quote/${encodeURIComponent(hash)}?showAll=true`} className={classname('text-gray-600 inline-block no-underline hover:underline rounded-r-full px-4 py-2 hover:bg-white', { 'font-semibold bg-gray-200 hover:bg-gray-200 text-gray-700 shadow-inner': showAll && showAll !== 'false' })}>Show all</a>
    </div>
  </div>
)
