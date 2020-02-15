import { useRouter } from 'next/router'
import { LoremIpsum } from "lorem-ipsum"

import { useFetch } from "components/hooks"
import Head from '../../components/head'
import Nav from '../../components/nav'
import Citation from '../../components/citation'

const lorem = new LoremIpsum({
  wordsPerSentence: {
    max: 24,
    min: 3
  }
})

export default (props) => {
  const router = useRouter()
  const [quote, loading] = (router.query.id) ? useFetch(`/api/quote?id=${encodeURIComponent(router.query.id)}`) : [null, true]
  //console.log(`/api/quote?id=${encodeURIComponent(router.query.id)}`)

  const citations = Array.from({length: Math.floor(Math.random() * 10) + 1 }).map(() => ({
    headline: lorem.generateSentences(1),
    source: lorem.generateWords(Math.floor(Math.random() * 3) + 1),
    tags: lorem.generateWords(Math.floor(Math.random() * 6) + 1).split(' '),
    domain: lorem.generateWords(1)+'.example.com'
  }))
  
  return (
    <>
      <Head title="Quote" />
      <Nav />
      {!loading &&
        <div className="m-auto mt-4 pl-4 pr-4 md:p-0" style={{maxWidth: 800}}>
          <h2 className="flex text-justify mb-5 sm:mb-10 text-2xl flex bg-gray-200 p-4 rounded-lg font-serif">
            <span className="hidden sm:flex leading-none font-bold text-gray-400 text-5xl mr-2">&ldquo;</span>
            <span className="flex m-auto text-gray-800">{quote?.quote}</span>
            <span className="hidden sm:flex leading-none font-bold text-gray-400 text-5xl ml-2">&rdquo;</span>
          </h2>
          <div className="relative">
            <div className="absolute flex border-l-4 border-gray-400 border-dotted" style={{
                zIndex: '-1',
                width: '10px',
                top: -40,
                bottom: 0,
                left: 48,
              }}/>
            {citations.map((citation, i) =>
              <Citation {...citation} position={i+1}/>
            )}          
          </div>
        </div>
      }
    </>
  )
}
