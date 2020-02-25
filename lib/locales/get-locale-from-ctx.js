import { locales, defaultLocale } from '../../locales'
import cookies from 'next-cookies'

export default (ctx) => {
  // Get locale from hostname
  const localeFromHeader = ctx?.req?.headers?.host?.split('.')?.[0]

  // Get locale from cookie (useful for testing)
  const { locale: localeFromCookie } = cookies(ctx)

  // Prefer locale set in cooke, then one from header, fallback to default locale
  if (locales[localeFromCookie]) {
    return localeFromCookie
  } else if (locales[localeFromHeader]) {
    return localeFromHeader
  } else {
    return defaultLocale
  }
}
