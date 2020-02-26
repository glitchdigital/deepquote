export default ({text}) => (
  <h2 className='flex font-serif text-justify mb-10 text-2xl px-4 py-6'>
    <span className='hidden sm:flex leading-none font-bold text-gray-500 text-5xl mr-2'>&ldquo;</span>
    <span className='flex m-auto text-gray-800'>{text}</span>
    <span className='hidden sm:flex leading-none font-bold text-gray-500 text-5xl ml-2'>&rdquo;</span>
  </h2>
)
