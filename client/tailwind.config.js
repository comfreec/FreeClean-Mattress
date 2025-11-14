/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'coway-blue': '#0066CC',
        'coway-navy': '#003366',
        'coway-green': '#00A86B',
      },
    },
  },
  plugins: [],
}
