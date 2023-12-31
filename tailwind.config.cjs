/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  mode: "jit",
  theme: {
    backgroundImage: {
      "home-desktop": "url('/images/home1.jpg')",
      "home-mobile": "url('/images/mobilehome1.jpg')",
    },
  },
  plugins: [],
};
