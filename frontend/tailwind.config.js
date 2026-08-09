/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        blush: {
          DEFAULT: "#F7E9E5",
          light: "#FCF4F1",
          deep: "#EAC7BE",
        },
        cream: "#FFFCFA",
        rosegold: {
          DEFAULT: "#C08872",
          deep: "#A2664E",
          light: "#D8AC9A",
        },
        plum: {
          DEFAULT: "#3E2A2C",
          soft: "#6B4E4F",
        },
        gold: {
          line: "#CBA07C",
          soft: "#E4C9A6",
        },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        body: ["'Jost'", "sans-serif"],
        label: ["'Poppins'", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(62, 42, 44, 0.18)",
      },
    },
  },
  plugins: [],
};
