/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
      },
      colors: {
        ink: 'var(--color-text)',
        accent: 'var(--color-accent)',
        login: 'var(--color-login-bg)',
      },
    },
  },
  plugins: [],
}
