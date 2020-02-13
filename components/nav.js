import { useState } from 'react'
import classname from 'classname'

const Nav = () => {
  const [menuOpenState, setMenuOpenState] = useState(false);
  const toggleMenuOpenState = () => setMenuOpenState(!menuOpenState);

  return (
  <header className={classname("border-b sm:flex sm:justify-between sm:items-center sm:px-4 sm:py-3 mb-5", {'bg-white shadow-xl': menuOpenState})}>
    <div className="flex items-center justify-between px-4 py-3 sm:p-0">
      <span className="border-2 border-transparent font-semibold text-gray-600">
        <span className="hidden sm:block md:hidden">DYRST?</span>
        <span className="block sm:hidden md:block">Did They Really Say That?</span>
      </span>
      <div className="sm:hidden">
        <button onClick={toggleMenuOpenState} type="button" className="block rounded-full p-1 hover:bg-gray-100 active:bg-gray-100 active:shadow-lg text-gray-500 hover:text-gray-600 focus:text-gray-600 focus:outline-none">
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            <path className={classname({ 'hidden': menuOpenState })} fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/>
            <path className={classname({ 'hidden': !menuOpenState })} fillRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"/>            
          </svg>
        </button>
      </div>
    </div>    
    <nav className={classname('px-2 pt-2 pb-4 sm:flex sm:p-0', { 'hidden': !menuOpenState })}>
      <input aria-label="Search" autocomplete="off" spellcheck="false"  className="mb-1 sm:mb-0 p-1 w-full bg-gray-300 outline-none xfocus:shadow-outline border-2 focus:border-blue-500 border-gray-300 focus:bg-white sm:w-auto pl-4 pr-4 focus:shadow-lg rounded-full" placeholder="Search..."/>
      <a href="#" className="border-2 border-transparent mt-1 sm:mt-0 sm:ml-2">Who we are</a>
      <a href="#" className="border-2 border-transparent mt-1 sm:mt-0 sm:ml-2">FAQ</a>
      <a href="#" className="border-2 border-transparent mt-1 sm:mt-0 sm:ml-2">Impressum</a>
    </nav>
  </header>
  )
}

export default Nav
