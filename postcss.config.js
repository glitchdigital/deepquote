const purgecss = [
  "@fullhuman/postcss-purgecss",
  {
    content: ["./components/**/*.js", "./pages/**/*.js"],
    whitelist: ['-zondicon'],
    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
  }
]
module.exports = {
  plugins: [
    'postcss-import',
    'postcss-nested',
    'postcss-preset-env',
    'tailwindcss',
    'autoprefixer',
    ...(process.env.NODE_ENV === "production" ? [purgecss] : [])
  ],
}

//whitelist: ['-zondicon']
//whitelistPatterns: [/-ml-48$/]