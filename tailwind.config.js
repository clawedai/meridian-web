/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#0A0E1A', 800: '#0F1629', 700: '#141E33', 600: '#1A2640' },
        accent: { DEFAULT: '#00D4FF', dim: '#0099BB', glow: 'rgba(0,212,255,0.15)' },
        surface: { DEFAULT: '#1E2640', hover: '#2A3350', border: '#2D3A52' },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
