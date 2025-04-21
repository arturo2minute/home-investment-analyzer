/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          'soft-teal': '#A7F3D0',
          "teal": "#269E78",
          "light-gray": "#F2F2F2",
          "med-gray": "#787878",
          "dark-gray": "#454D5C",
          "white-smoke": "#F3F4F6",
          "green": "#00B31B",
        },
      },
    },
    plugins: [],
  };