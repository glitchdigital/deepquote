import { locales, defaultLocale } from '../../locales'

export default (locale) => (locales[locale]) ? locales[locale] : locales[defaultLocale]