import { LoremIpsum } from "lorem-ipsum"
import Head from '../components/head'
import Nav from '../components/nav'
import Citation from '../components/citation'

const lorem = new LoremIpsum({
  wordsPerSentence: {
    max: 24,
    min: 3
  }
})

export default () => {
  return (
    <>
      <Head title="Timeline" />
      <Nav />
      <div className="m-auto pl-4 pr-4 md:p-0" style={{maxWidth: 700}}>
        <h2 className="flex text-justify mb-5 sm:mb-10 text-2xl flex bg-gray-200 p-4 rounded-lg font-serif">
          <span className="hidden sm:flex leading-none font-bold text-gray-400 text-5xl mr-2">&ldquo;</span>
          <span className="flex m-auto text-gray-800">{lorem.generateSentences(1)}</span>
          <span className="hidden sm:flex leading-none font-bold text-gray-400 text-5xl ml-2">&rdquo;</span>
        </h2>
        <Citation headline="First article headline" source="Source #1"/>
        <Citation headline="Second article headline" source="Source #2"/>
        <Citation headline="Third article headline" source="Source #3"/>
      </div>
    </>
  )
}
