/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './constants.tsx'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      colors: {
        brand: {
          dark: '#0f172a',
          primary: '#1e293b',
          secondary: '#334155',
          accent: '#2563eb',
          surface: '#f8fafc',
          border: '#e2e8f0'
        }
      }
    }
  },
  plugins: []
};
