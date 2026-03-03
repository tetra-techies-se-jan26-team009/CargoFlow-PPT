/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        text: '#190808',
        background: '#ffffff',
        primary: '#3a61ab',
        secondary: '#a4b787',
        tertiary: '#0f1c2e',
        accent: '#f4f4f4',
      },
    },
  },
  plugins: [],
};