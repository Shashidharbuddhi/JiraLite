/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Manrope', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        surface: {
          DEFAULT: '#ffffff',
          dark: '#09090b'
        },
        'surface-raised': {
          DEFAULT: '#f8fafc',
          dark: '#111827'
        },
        'surface-overlay': {
          DEFAULT: '#ffffff',
          dark: '#18181b'
        },
        'border-subtle': {
          DEFAULT: '#e2e8f0',
          dark: '#1e293b'
        }
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        elevated: '0 8px 24px rgba(0,0,0,0.08)',
        modal: '0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)'
      },
      transitionDuration: {
        DEFAULT: '150ms'
      }
    }
  },
  plugins: []
};
