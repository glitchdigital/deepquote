import NextApp from 'next/app'
import { I18nProvider } from '@lingui/react'
import { Provider as NextAuthProvider } from 'next-auth/client'

import catalog from 'lib/locales/catalog'
import getLocale from 'lib/locales/get-locale'

import './_app.css'

export default class App extends NextApp {
  static async getInitialProps({ Component, ctx }) {

    const locale = getLocale(ctx)

    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps, locale }
  }

  render() {
    const { Component, pageProps, locale } = this.props

    return (
      <NextAuthProvider session={pageProps.session}>
        <I18nProvider language={locale} catalogs={{ [locale]: catalog(locale) }}>
          <Component {...pageProps} />
        </I18nProvider>
      </NextAuthProvider> 
    )
  }
}
