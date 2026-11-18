/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF4EB',
          200: '#F4E8D7',
          300: '#EAD7BF',
        },
        terracotta: {
          50: '#FDF4F0',
          100: '#FBE8E0',
          200: '#F6D2C2',
          400: '#DF7B54',
          500: '#C85A32',
          600: '#B24723',
          700: '#943719',
        },
        saffron: {
          50: '#FFF9E6',
          100: '#FFF0BF',
          500: '#E68A00',
          600: '#CC7700',
        },
        earth: {
          800: '#43281C',
          900: '#2C1810',
          950: '#1D100A',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
