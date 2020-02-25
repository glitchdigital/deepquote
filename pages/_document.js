import NextDocument, { Head, Main, NextScript } from 'next/document'

import getLocale from 'lib/locales/get-locale'

export default class Document extends NextDocument {
  static async getInitialProps(ctx) {
    const initialProps = await NextDocument.getInitialProps(ctx)

    const locale = getLocale(ctx)

    // Load source for translation file and inject into page
    let i18nCatalog = await import(`raw-loader!../locales/${locale}/messages.js`).then(mod => mod.default)
    i18nCatalog = i18nCatalog.replace('module.exports = {', 'window.i18n_catalog = {')

    return { ...initialProps, locale, i18nCatalog }
  }

  render() {
    const { locale, i18nCatalog } = this.props
    return (
      <html lang={locale}>
        <Head>
          <script dangerouslySetInnerHTML={{ __html: i18nCatalog }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}