import { useState } from 'react'
import Link from 'next/link'
import classname from 'classname'
import { Home, Search } from 'react-zondicons'

export default () => {
  const [menuOpenState, setMenuOpenState] = useState(false)
  const toggleMenuOpenState = () => setMenuOpenState(!menuOpenState)

  return (
  <header className={classname('border-b sm:flex sm:justify-between sm:items-center sm:px-4 sm:py-3', {'bg-white sm:bg-transparent shadow-xl sm:shadow-none': menuOpenState})}>
    <div className='flex items-center justify-between px-4 py-3 sm:p-0'>
      <Link href='/'>
        <a className='no-underline hover:underline border-2 border-transparent text-gray-800 hover:text-blue-500'>
          <span className='hidden sm:inline lg:hidden'><Home/></span>
          <span className='inline sm:hidden lg:inline text-lg font-bold'>Did They Really Say That?</span>
        </a>
      </Link>
      <div className='sm:hidden'>
        <button aria-label='Menu' onClick={toggleMenuOpenState} type='button' className='block rounded-full p-1 hover:bg-gray-100 active:bg-gray-100 active:shadow-lg text-gray-500 hover:text-gray-600 focus:text-gray-600 focus:outline-none'>
          <svg className='h-6 w-6 fill-current' viewBox='0 0 24 24' alt='Menu' aria-hidden='true'>
            <path className={classname({ 'hidden': menuOpenState })} fillRule='evenodd' d='M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z'/>
            <path className={classname({ 'hidden': !menuOpenState })} fillRule='evenodd' d='M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z'/>
          </svg>
        </button>
      </div>
    </div>
    <nav className={classname('font-semibold px-2 pt-2 pb-4 sm:flex sm:p-0', { 'hidden': !menuOpenState })}>
      <div className='relative'>
        <Search className='text-gray-500 pointer-events-none' style={{position: 'absolute', left: 14, top: 12}}/>
        <input aria-label='Search' autoComplete='off' spellCheck='false'  className='mb-1 sm:mb-0 py-2 pr-4 pl-10 w-full bg-gray-200 border-gray-200 outline-none  border-2 focus:border-blue-500 focus:bg-white sm:w-auto focus:shadow-lg rounded-full' placeholder='Search...'/>
      </div>
      <a href='#' className='border-2 border-transparent mt-0 sm:mt-1 sm:ml-2'>Who we are</a>
      <a href='#' className='border-2 border-transparent mt-0 sm:mt-1 sm:ml-2'>FAQ</a>
      <a href='#' className='border-2 border-transparent mt-0 sm:mt-1 sm:ml-2'>Impressum</a>
    </nav>
  </header>
  )
}