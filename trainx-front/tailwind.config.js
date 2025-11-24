/** @type {import('tailwindcss').config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        negro: '#121212',
        naranja: '#FF6B00', 
        
      },
  },
  },
  plugins: [],
} 
