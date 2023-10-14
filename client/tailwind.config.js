/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      emerald: '#27CE8E',
      honeydew: '#EBFFF7',
      'black-olive': '#29332F',
      jade: '#22A875',
      'off-white': '#FCFFFE',
      'white-smoke': '#F5F5F5',
      transparent: 'rgba(0,0,0,0)',
    },
    extend: {
      backgroundImage: {
        'hero-pattern':
          "linear-gradient(to right bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/public/images/home-bg-med.jpg')",
      },
      backgroundSize: {
        90: '90%',
        50: '50%',
        75: '75%',
        200: '200%',
        cover: 'cover',
        contain: 'contain',
      },
    },
  },
  plugins: [],
};
