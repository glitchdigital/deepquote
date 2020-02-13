import { LoremIpsum } from "lorem-ipsum"
import Head from '../components/head'
import Nav from '../components/nav'
import { Time, NavigationMore } from 'react-zondicons'

const lorem = new LoremIpsum({
  wordsPerSentence: {
    max: 24,
    min: 3
  }
})

const Card = () => (
  <div className="inline-block relative text-left rounded-lg border bg-white m-2">
      <h2 className="flex text-center p-4 mb-10 text-justify font-serif">
        <span className="hidden sm:flex leading-none font-bold text-gray-400 text-3xl">&ldquo;</span>
        <a href="/timeline" className="flex no-underline text-gray-600 ml-2 mr-2">
          <span className="flex text-gray-800">{lorem.generateSentences(1)}</span>
        </a>
        <span className="hidden sm:flex leading-none font-bold text-gray-400 text-3xl">&rdquo;</span>
      </h2>
      <p className="pl-4 pr-4 pt-2 pb-2 bg-gray-200 absolute bottom-0 w-full">
        <span className="text-gray-600"><Time/>YYYY-MM-DD</span>
        <a href="/timeline" className="text-gray-600 float-right underline"><NavigationMore/></a>
      </p>
  </div>
)

export default () => {
  return (
    <>
      <Head title="Did They Really Say That?" />
      <Nav />
      <div className="grid md:grid-cols-3 pl-2 pr-2 mb-2">
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
      </div>
    </>
  )
}
