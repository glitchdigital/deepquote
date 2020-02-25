const path = require('path')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  webpack(config, { isServer }) {
    config.resolve.modules.unshift(path.resolve('./'))
    config.resolve.alias = config.resolve.alias || {} 
    config.resolve.alias['lib/locales/catalog'] = path.resolve(
      __dirname,
      isServer ? './lib/locales/catalog.server.js' : './lib/locales/catalog.client.js'
    )
    // Fixes npm packages that depend on `fs` module
    config.node = { fs: 'empty' }
    return config
  }
})