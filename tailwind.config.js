/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        corporate: {
          dark: '#0a192f',
          blue: '#1e3a8a',
          light: '#f3f4f6',
          accent: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Pacifico', 'cursive'],
      }
    },
  },
  plugins: [],
}
