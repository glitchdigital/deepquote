import { locales, defaultLocale } from '../../locales'

export default (ctx) => {
  // Get locale from hostname (eg `en.example.com` or `de.example.com`)
  const localeFromHeader = ctx?.req?.headers?.host?.split('.')?.[0]

  // If locale from hostname not defined, then use defaultLocale
  return (locales[localeFromHeader]) ? localeFromHeader : defaultLocale
}
