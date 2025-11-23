/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2563eb',
          accent: '#0ea5e9',
          muted: '#e2e8f0',
        },
        chart: {
          income: '#0ea5e9',
          spending: '#475569',
          savings: '#22c55e',
          discretionary: '#a855f7',
          essential: '#f97316',
          neutral: '#cbd5e1',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
