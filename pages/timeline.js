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
  const citations = Array.from({length: Math.floor(Math.random() * 10) + 1 }).map(() => ({
    headline: lorem.generateSentences(1),
    source: lorem.generateWords(Math.floor(Math.random() * 3) + 1),
    tags: lorem.generateWords(Math.floor(Math.random() * 6) + 1).split(' '),
    domain: lorem.generateWords(1)+'.example.com'
  }))
  return (
    <>
      <Head title="Timeline" />
      <Nav />
      <div className="m-auto mt-4 pl-4 pr-4 md:p-0" style={{maxWidth: 800}}>
        <h2 className="flex text-justify mb-5 sm:mb-10 text-2xl flex bg-gray-200 p-4 rounded-lg font-serif">
          <span className="hidden sm:flex leading-none font-bold text-gray-400 text-5xl mr-2">&ldquo;</span>
          <span className="flex m-auto text-gray-800">{lorem.generateSentences(1)}</span>
          <span className="hidden sm:flex leading-none font-bold text-gray-400 text-5xl ml-2">&rdquo;</span>
        </h2>
        {citations.map((citation) =>
          <Citation {...citation}/>
        )}
      </div>
    </>
  )
}
