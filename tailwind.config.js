/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors:{
          'SoftRed':'hsl(11,95%,60%)',
          'SoftOrange':'hsl(35,77%,62%)',
          'DarkBlue':'hsl(225,17%,3%)',
          'Gris':'hsl(15,10%,23%)',
          'GrisClaro':'hsl(15,5%,63%)',
          'AzulOscuro':'#0A1220',
        }
    },
  },
  plugins: [],
}

