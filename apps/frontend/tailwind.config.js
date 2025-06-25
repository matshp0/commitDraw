/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0D1117',
        'cell-empty': '#151B23',
        'color-1': '#033A16',
        'color-2': '#196C2E',
        'color-3': '#2EA043',
        'color-4': '#56D364',
      },
    },
  },
  plugins: [],
};
