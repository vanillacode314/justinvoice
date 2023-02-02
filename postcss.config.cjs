const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')
const nested = require('postcss-nested')

const config = {
	plugins: [tailwindcss(), nested, autoprefixer]
}

module.exports = config
