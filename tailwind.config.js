/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(220, 20%, 98%)',
        text: 'hsl(220, 30%, 15%)',
        accent: 'hsl(300, 70%, 60%)',
        primary: 'hsl(240, 80%, 50%)',
        surface: 'hsl(220, 20%, 100%)',
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 30%, 15%, 0.1)',
      },
      spacing: {
        'lg': '24px',
        'md': '16px',
        'sm': '8px',
      },
    },
  },
  plugins: [],
}