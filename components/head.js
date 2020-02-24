import NextHead from 'next/head'

const defaultDescription = 'Did they really say that?'
const defaultOGURL = ''
const defaultOGImage = ''

export default (props) => (
  <NextHead>
    <meta charSet='UTF-8' />
    <title>{props.title || ''}</title>
    <meta name='description' content={props.description || defaultDescription} />
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    <link rel='icon' sizes='192x192' href='/static/touch-icon.png' />
    <link rel='apple-touch-icon' href='/static/touch-icon.png' />
    <link rel='mask-icon' href='/static/favicon-mask.svg' color='#49B882' />
    <link rel='icon' href='/static/favicon.ico' />
    <meta property='og:url' content={props.url || defaultOGURL} />
    <meta property='og:title' content={props.title || ''} />
    <meta property='og:description' content={props.description || defaultDescription} />
    <meta name='twitter:site' content={props.url || defaultOGURL} />
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:image' content={props.ogImage || defaultOGImage} />
    <meta property='og:image' content={props.ogImage || defaultOGImage} />
    <meta property='og:image:width' content='1200' />
    <meta property='og:image:height' content='630' />
    {/* https://fonts.google.com/specimen/Nunito */ }
    <link href='https://fonts.googleapis.com/css?family=Nunito:400,600,700,800&display=swap' rel='stylesheet' />
  </NextHead>
)

