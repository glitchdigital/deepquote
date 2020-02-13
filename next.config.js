const withPurgeCss = require('next-purgecss')

module.exports = withPurgeCss({
  webpack: (config) => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    }

    return config
  }
})
