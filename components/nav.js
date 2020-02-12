import { useState } from 'react'
import classname from 'classname'

const Nav = () => {
  const [menuOpenState, setMenuOpenState] = useState(false);
  const toggleMenuState = () => setMenuOpenState(!menuOpenState);

  return (
  <header className="bg-gray-100 border-b border-gray-300 sm:flex sm:justify-between sm:items-center sm:px-4 sm:py-3 mb-5">
    <div className="flex items-center justify-between px-4 py-3 sm:p-0">
      <div>
        {/*<img className="h-8" src="/img/logo.svg" alt="Logo"/>*/}
        <span className="font-light">Did They Really Say That?</span>
      </div>
      <div className="sm:hidden">
        <button onClick={toggleMenuState} type="button" className="block text-gray-500 hover:text-gray-800 focus:text-white focus:outline-none">
          <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24">
            <path className={classname({ 'hidden': menuOpenState })} fill-rule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/>
            <path className={classname({ 'hidden': !menuOpenState })} fill-rule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"/>            
          </svg>
        </button>
      </div>
    </div>
    <nav className={classname('px-2 pt-2 pb-4 sm:flex sm:p-0', { 'hidden': !menuOpenState })}>
      <a href="#" className="no-underline block px-2 py-1 font-semibold rounded hover:bg-gray-300">Who we are</a>
      <a href="#" className="no-underline mt-1 block px-2 py-1 font-semibold rounded hover:bg-gray-300 sm:mt-0 sm:ml-2">FAQ</a>
      <a href="#" className="no-underline mt-1 block px-2 py-1 font-semibold rounded hover:bg-gray-300 sm:mt-0 sm:ml-2">Messages</a>
    </nav>
  </header>
  )
}

export default Nav
