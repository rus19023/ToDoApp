/** @type {import('tailwindcss').Config} */

const path = require('path');
const withMT = require("@material-tailwind/html/utils/withMT");

/** @type {import('tailwindcss').Config} */

module.exports = withMT(
  {
    content: [
      path.join(__dirname, 'src/**/*.js'),
      path.join(__dirname, 'src/**/*.html')
    ],
    theme: {
      colors: {
        'medblue': '#0057b7',
        'royalblue': '#0500b7',
        'purple': '#6000b7',
        'hotpink': '#b700b3',
        'redorange': '#b70500',
        'dksalmon': '#b70057',
        'orange': '#ff7849',
        'yellow': '#ffd700', 
        'chartreuse': '#28ff00',
        'seafoam': '#00ff58', 
        'skyblue': '#00ffd7',
        'gray-dark': '#273444',
        'gray': '#8492a6',
        'gray-light': '#d3dce6',
        'black': '#000000',
        'white': '#ffffff'
      },
      extend: {

      },
    },
    plugins: [],
  }
);
