export default function timelineQuote({text}) {
  return (
    <h2 className='flex font-serif text-justify mb-20 text-xl px-4 py-6'>
      <span className='hidden sm:flex leading-none font-bold text-gray-500 text-5xl mr-4'>&ldquo;</span>
      <span className='flex m-auto text-gray-800'>{text}</span>
      <span className='hidden sm:flex leading-none font-bold text-gray-500 text-5xl ml-4'>&rdquo;</span>
    </h2>
  )
}
