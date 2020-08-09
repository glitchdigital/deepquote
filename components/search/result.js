import Link from 'next/link'

// export default ({text, hash}) => (
//   <div className='border-b-2 mb-5'>
//     <Link href={`/quote/[id]`} as={`/quote/${hash}`}>
//       <a className='no-underline text-gray-800 hover:text-blue-500 px-4 py-6 block'>
//         <h2 className='no-underline flex font-serif text-justify text-xl'>
//           <span className='hidden sm:flex leading-none font-bold text-gray-500 text-3xl mr-2'>&ldquo;</span>
//           <span className='flex m-auto'>{text}</span>
//           <span className='hidden sm:flex leading-none font-bold text-gray-500 text-3xl ml-2'>&rdquo;</span>
//         </h2>
//       </a>
//     </Link>
//   </div>
// )

export default function searchResult({text, hash}) {
  return (
    <div className='rounded-lg bg-gray-300 mb-5'>
      <Link href={`/quote/[id]`} as={`/quote/${hash}`}>
        <a className='no-underline text-gray-800 hover:text-blue-500 px-4 py-6 block'>
          <h2 className='no-underline flex font-serif text-justify text-xl'>
            <span className='hidden sm:flex leading-none font-bold text-gray-500 text-3xl mr-2'>&ldquo;</span>
            <span className='flex m-auto'>{text}</span>
            <span className='hidden sm:flex leading-none font-bold text-gray-500 text-3xl ml-2'>&rdquo;</span>
          </h2>
        </a>
      </Link>
    </div>
  )
}