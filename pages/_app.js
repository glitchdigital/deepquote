import NextApp from 'next/app'
import { I18nProvider } from '@lingui/react'

import catalog from 'lib/locales/catalog'
import getLocaleFromCtx from 'lib/locales/get-locale-from-ctx'

import './_app.css'

export default class App extends NextApp {
  static async getInitialProps({ Component, ctx }) {

    const locale = getLocaleFromCtx(ctx)

    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps, locale }
  }

  render() {
    const { Component, pageProps, locale } = this.props

    return (
      <I18nProvider language={locale} catalogs={{ [locale]: catalog(locale) }}>
        <Component {...pageProps} />
      </I18nProvider>
    )
  }
}
