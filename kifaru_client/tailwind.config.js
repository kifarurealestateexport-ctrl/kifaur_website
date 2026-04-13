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
        'brand-navy':  '#1a237e',   // matches the logo — true deep blue
        'brand-blue':  '#283593',   // slightly lighter blue for hover states
        'brand-cream': '#F8F6F1',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        sans:    ['Poppins', 'sans-serif'], 
      },
    },
  },
  plugins: [],
}
