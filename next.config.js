const path = require('path')

module.exports = {
  webpack: (config) => {
    config.resolve.modules.unshift(path.resolve('./'))
    // Fixes npm packages that depend on `fs` module
    config.node = { fs: 'empty' }
    return config
  }
}
