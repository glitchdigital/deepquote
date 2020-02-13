import Head from '../components/head'
import Nav from '../components/nav'

const Citation = ({headline, source}) => (
  <div class="flex mb-5 sm:mb-10">
    <div style={{width: 100}} className="hidden sm:block">
      <div style={{height: 40, width: 40}} className="mt-5 m-auto bg-white border-4 rounded-full"/>
    </div>
    <div className="flex-auto">
      <div className="bg-white w-full text-left inline-block transition-shadow duration-300 ease-in-out shadow-md sm:shadow-lg hover:shadow-xl rounded-lg">
        <div className="pt-4 pl-4 pr-4">
          <span className="uppercase text-gray-500 font-bold">{source}</span>
          <p className="text-xl font-light mb-3">{headline}</p>
        </div>
        <p className="pl-4 pr-4 pt-2 pb-2 bg-gray-200">
          <span className="text-gray-600">YYYY-MM-DD</span>
          <span className="text-gray-600 float-right underline">example.com</span>
        </p>
      </div>
    </div>
  </div>
)

export default () => {
  return (
    <div>
      <Head title="Home" />
      <Nav />
      <div className="text-center m-auto pl-4 pr-4 sm:p-0" style={{maxWidth: 700}}>
        <h2 className="flex mb-5 sm:mb-10 text-2xl text-gray-600 flex bg-gray-200 p-4 rounded-lg font-serif">
          <span className="hidden sm:flex leading-none font-bold text-gray-400 text-4xl">&ldquo;</span>
          <span className="flex">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
          <span className="hidden sm:flex leading-none font-bold text-gray-400 text-4xl">&rdquo;</span>
        </h2>
        <Citation headline="First article headline" source="Source #1"/>
        <Citation headline="Second article headline" source="Source #2"/>
        <Citation headline="Third article headline" source="Source #3"/>
      </div>
    </div>
  )
}
