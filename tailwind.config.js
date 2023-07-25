/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx,css}"],
  content: ["./src/**/*.{js,jsx,ts,tsx,css}"],
  theme: {
    extend: {
      boxShadow: {
        cover:
          "0px 7px 14px rgba(0,0,0,.05),0px 0px 3.12708px rgba(0,0,0,.08),0px 0px 0.931014px rgba(0,0,0,.17)",
      },
      fontSize: {
        xxs: "0.5rem",
      },
    },
  },
  plugins: [],
};
