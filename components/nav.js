import { useRef, useState } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import classname from 'classname'
import { Home, Search } from 'react-zondicons'
import { signIn, signOut, useSession } from 'next-auth/client'

export default function nav({defaultSearchText}) {
  const [ session, loading ] = useSession()
  const searchInput = useRef()
  const [menuOpenState, setMenuOpenState] = useState(false)
  const [accountMenuOpenState, setAccountMenuOpenState] = useState(false)

  const toggleMenuOpenState = () => {
    // Set focus on search input when menu is opened
    if (!menuOpenState) setTimeout(() => searchInput.current.focus(), 100)
    setMenuOpenState(!menuOpenState)
  }

  const [searchText = '', setSearchText] = useState(defaultSearchText)
  const onSearchTextChange = event => setSearchText(event.target.value)

  const onSearchFormSubmit = event => {
    event.preventDefault()
    setMenuOpenState(false) // Collapse menu on mobile immediately after searching
    const href = `/search?t=${encodeURIComponent(searchText)}`
    const as = href
    Router.push(href, as)
  }

  return (
  <header className={classname('relative z-10 border-b sm:flex sm:justify-between sm:items-center sm:px-4 sm:py-3 bg-white', {'shadow-xl sm:shadow-none': menuOpenState})}>
    <div className='flex items-center justify-between px-4 py-3 sm:p-0'>
      <Link href='/'>
        <a className='no-underline hover:underline border-2 border-transparent text-gray-800 hover:text-blue-500'>
          <span className='hidden sm:inline lg:hidden text-blue-600'><Home/></span>
          <span className='inline sm:hidden lg:inline text-lg text-blue-600 font-bold'>DeepQuote.io</span>
        </a>
      </Link>
      <div className='sm:hidden'>
        <button aria-label='Menu' onClick={toggleMenuOpenState} type='button' className='float-right inline-block rounded-full p-1 hover:bg-gray-100 active:bg-gray-100 active:shadow-lg text-gray-600 hover:text-gray-800 focus:text-gray-600'>
          <svg className='h-6 w-6 fill-current' viewBox='0 0 24 24' alt='Menu' aria-hidden='true'>
            <path className={classname({ 'hidden': menuOpenState })} fillRule='evenodd' d='M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z'/>
            <path className={classname({ 'hidden': !menuOpenState })} fillRule='evenodd' d='M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z'/>
          </svg>
        </button>
      </div>
    </div>
    <nav className={classname('font-semibold px-2 pt-2 pb-4 sm:flex sm:p-0', { 'hidden': !menuOpenState })}>
      <form method='GET' action='/search' className='relative' onSubmit={onSearchFormSubmit}>
        <Search className='text-gray-500 pointer-events-none' style={{position: 'absolute', left: 14, top: 12}}/>
        <input
          id='searchInput'
          name='t'
          ref={searchInput}
          aria-label='Search'
          autoComplete='off'
          spellCheck='false'
          className='mb-1 sm:mb-0 py-2 pr-4 pl-10 w-full bg-gray-200 border-gray-200 outline-none border-2 focus:border-blue-500 focus:bg-white sm:w-auto focus:shadow-lg rounded-full'
          placeholder='Search...'
          value={searchText}
          onChange={onSearchTextChange}
          />
      </form>
      <a href='#' className='border-2 border-transparent mt-1 sm:ml-2'>Who we are</a>
      <a href='#' className='border-2 border-transparent mt-1 sm:ml-2'>FAQ</a>
      <a href='#' className='border-2 border-transparent mt-1 sm:ml-2'>Impressum</a>
      {!loading && !session &&
        <button onClick={() => signIn('google')} className='ml-1 bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded'>
          Sign in
        </button>
      }
      {session && <>
        <a href='#' 
          className={classname(
            'relative border-2 px-2 border-transparent sm:ml-2 text-gray-600 hover:text-gray-600',
            { 'bg-blue-500 rounded-full': accountMenuOpenState },
            { 'hover:bg-gray-100 rounded-full': !accountMenuOpenState },
            { 'hidden': menuOpenState }
          )}
          onClick={(e) => {
          e.preventDefault()
          setAccountMenuOpenState(!accountMenuOpenState)
        }}>
          <svg 
            className={classname(
              'mt-1 h-6 w-6 fill-current',
              { 'text-white': accountMenuOpenState },
              { 'hidden': menuOpenState }
            )}
            viewBox='0 0 24 24' alt='Menu' aria-hidden='true'>
            <path fillRule='evenodd' d='M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z'/>
          </svg>
          <div 
            className='rounded-full absolute top-0 right-0'
            style={{
              width: '100%',
              height: '100%',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundImage: `url(${session.user.image})`
            }} />
        </a>

        {(accountMenuOpenState || menuOpenState) &&
          <div 
            className={classname(
              'font-normal',
              { 'text-left mt-2': menuOpenState },
              { 'absolute right-0 text-smx z-50 float-left text-right rounded shadow-lg bg-white mr-2': !menuOpenState }
            )}
            style={{minWidth: '10rem', top: '4rem', right: '1rem'}}
          >
          <p className='px-4 py-2 bg-blue-500 rounded-tl rounded-tr'>
            <span className='block text-white'>
              { session.user.email || session.user.name }
            </span>
          </p>
          {/* <div className='h-0 border border-solid border-t-0 border-gray-400 opacity-25'/> */}
          <p className='px-4 py-2'>
            <a href='/api/auth/signout'
              className='no-underline hover:underline block text-gray-600'
              onClick={(e) => {
                e.preventDefault()
                signOut({callbackUrl: '/'})
              }}
              >
              Sign out
            </a>
          </p>
        </div>
      }
      </>}
    </nav>
  </header>
  )
}