/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      emerald: '#27CE8E',
      honeydew: '#EBFFF7',
      'disabled-font-jade': '#66DFAE',
      black: '#282924',
      gray: '#6E6E6E',
      mint: '#E7F3F0',
      jade: '#22A875',
      'washed-jade': '#5CC79E',
      'off-white': '#f7f7f7',
      'white-smoke': '#F5F5F5',
      'light-gray': '#fcfcfc',
      transparent: 'rgba(0,0,0,0)',
      vermillion: '#FF312E',
      red: '#FF7A78',
      'hover-red': '#ff8785',
      rose: '#FFDEDD',
      white: '#ffffff',
      modal: 'rgba(0,0,0,0.5)',
      'birdie-green': '#6bc3a1',
      'ace-blue': '#00A1E6',
      'bogey-red': '#f7bdb1',
      dblbogey: '#f7927c',
      trpbogey: '#f66747',
    },
    extend: {
      backgroundImage: {
        'hero-pattern':
          "linear-gradient(to right bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/home-bg-med.jpg')",
      },
      backgroundSize: {
        90: '90%',
        50: '50%',
        75: '75%',
        200: '200%',
        cover: 'cover',
        contain: 'contain',
      },
      translate: {
        '70r': '70%',
        '78r': '78%',
      },
    },
  },
  plugins: [],
};
