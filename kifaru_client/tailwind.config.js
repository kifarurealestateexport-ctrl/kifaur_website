/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-red':   '#C0392B',
        'brand-gold':  '#D4A843',
        'brand-navy':  '#1a237e',
        'brand-blue':  '#283593',
        'brand-cream': '#F8F6F1',
      },
      fontFamily: {
        heading: ['Roboto', 'sans-serif'],
        sans:    ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}