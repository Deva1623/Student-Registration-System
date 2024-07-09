/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./src/index.js"],
  theme: {
    extend: {
      maxHeight: {
        '128': '28rem',
      }
    },
  },
  plugins: [],
}

