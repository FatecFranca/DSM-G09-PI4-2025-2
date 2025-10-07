import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        ouviot: {
          primary: "#6A4C93",
          secondary: "#8AC926",
          accent: "#FFCA3A",
          neutral: "#0b1021",
          "base-100": "#ffffff",
          info: "#1982C4",
          success: "#8AC926",
          warning: "#FFCA3A",
          error: "#FF595E",
        },
      },
    ],
  },
};
