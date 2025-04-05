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
        primary: {
          50: '#f8f7f4',
          100: '#e9e6df',
          200: '#d5cebe',
          300: '#bfb096',
          400: '#ab9572',
          500: '#967c58', // couleur principale
          600: '#7c6548',
          700: '#65523c',
          800: '#524232',
          900: '#433729',
          950: '#251e17',
        },
        accent: {
          300: '#c4b7a6',
          400: '#afa18e',
          500: '#8c7964', // accent secondaire
          600: '#675a4a',
        },
        beige: {
          100: '#f5f3ef',
          200: '#ebe6dd', // fond clair
          300: '#ddd5c8',
        },
      },
      fontFamily: {
        sans: ['var(--font-cormorant)', 'serif'],
        serif: ['var(--font-poppins)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
