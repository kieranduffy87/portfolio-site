/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        askan: ['"Askan Light"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
