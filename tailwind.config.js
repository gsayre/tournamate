module.exports = {
  mode: 'jit',
  content: ['./app/**/*.{ts,tsx,js,jsx}'],
  theme: {
    screens: {
      mobile_portrait: '320px',
      // => @media (min-width: 320px) { ... }

      mobile_landscape: '481px',
      // => @media (min-width: 481px) { ... }

      tablet_portrait: '641px',
      // => @media (min-width: 641px) { ... }

      tablet_landscape: '961px',
      // => @media (min-width: 961px) { ... }

      laptop: '1025px',
      // => @media (min-width: 1024px) { ... }

      desktop: '1280px',
      // => @media (min-width: 1280px) { ... }
    },
  },
  plugins: [],
};
