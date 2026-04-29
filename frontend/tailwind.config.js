/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Importante: esto le dice a Tailwind dónde buscar las clases
  ],
  theme: {
    extend: {
      colors: {
        'edomex-maroon': '#9D2449', // Tu color Guinda
        'edomex-gold': '#B38E5D',   // Tu color Dorado
        'edomex-dark-gold': '#8a6d3b',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}


