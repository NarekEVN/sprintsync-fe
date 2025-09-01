/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    await import('@tailwindcss/forms').then(m => m.default),
    await import('@tailwindcss/typography').then(m => m.default),
  ],
}
