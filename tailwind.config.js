/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Purane Colors Wapas Set Kiye
        brandOrange: "#FF6B00", 
        brandGreen: "#006400",  
        textmain: "#0F172A",
        sectionalt: "#F9FAFB",
      },
    },
  },
  plugins: [],
};