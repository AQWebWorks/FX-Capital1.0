module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "poloniex-blue": "#1666f6",
        "poloniex-dark": "#0f172a",
        "poloniex-gray": "#1e293b",
      },
      keyframes: {
        float: {
          "0%": { transform: "translateY(100vh) rotateY(0deg)", opacity: "0" },
          "25%": { opacity: "0.5" },
          "50%": { transform: "translateY(-10vh) rotateY(180deg)", opacity: "1" },
          "100%": { transform: "translateY(-120vh) rotateY(360deg)", opacity: "0" },
        },
        slowspin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        float: "float linear infinite",
        slowspin: "slowspin 20s linear infinite",
      },
      fontFamily: {
        sans: ["'IBM Plex Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
