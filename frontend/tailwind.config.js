/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'app-gradient': 'linear-gradient(90deg, #ffafcc, #b39ddb, #89cff0)',
      },
    },
  },
  plugins: [],
};



