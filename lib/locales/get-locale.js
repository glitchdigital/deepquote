import { locales, defaultLocale } from '../../locales'

export default (ctx) => {
  // @TODO On Vercel, the first result for a deployment will be cached.
  //
  //       To work around this, we need to create multiple instances of the app
  //       to support multiple  languages using different hostnames.
  //       This code should be refactored accordingly to return
  //       process.env.LOCALE as the locale (if it is a valid locale).
  //
  //       Once this is done, we should also look at refactoring _app.js to
  //       improve performance.
  /*
  // Get locale from hostname (eg `en.example.com` or `de.example.com`)
  const localeFromHeader = ctx?.req?.headers?.host?.split('.')?.[0]

  // If locale extract from hostname is not defined, then use defaultLocale
  return (locales[localeFromHeader]) ? localeFromHeader : defaultLocale
  */
  return defaultLocale
}
