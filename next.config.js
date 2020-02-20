const path = require('path')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  webpack: (config) => {
    config.resolve.modules.unshift(path.resolve('./'))
    // Fixes npm packages that depend on `fs` module
    config.node = { fs: 'empty' }
    return config
  }
})