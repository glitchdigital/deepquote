import Head from '../components/head'
import Nav from '../components/nav'
import Citation from '../components/citation'

export default () => {
  return (
    <div>
      <Head title="Home" />
      <Nav />
      <div className="text-center m-auto pl-4 pr-4 sm:p-0" style={{maxWidth: 700}}>
        <h2 className="flex mb-5 sm:mb-10 text-2xl flex bg-gray-200 p-4 rounded-lg font-serif">
          <span className="hidden sm:flex leading-none font-bold text-gray-400 text-5xl">&ldquo;</span>
          <span className="flex text-gray-800">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
          <span className="hidden sm:flex leading-none font-bold text-gray-400 text-5xl">&rdquo;</span>
        </h2>
        <Citation headline="First article headline" source="Source #1"/>
        <Citation headline="Second article headline" source="Source #2"/>
        <Citation headline="Third article headline" source="Source #3"/>
      </div>
    </div>
  )
}
