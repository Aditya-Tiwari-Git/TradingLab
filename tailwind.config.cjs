/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          950: 'rgb(var(--bg-950) / <alpha-value>)',
          900: 'rgb(var(--bg-900) / <alpha-value>)',
          850: 'rgb(var(--bg-850) / <alpha-value>)',
          800: 'rgb(var(--bg-800) / <alpha-value>)',
          700: 'rgb(var(--bg-700) / <alpha-value>)',
          600: 'rgb(var(--bg-600) / <alpha-value>)',
        },
        card: 'rgb(var(--card) / <alpha-value>)',
        accent: {
          500: 'rgb(var(--accent-500) / <alpha-value>)',
          400: 'rgb(var(--accent-400) / <alpha-value>)',
          300: 'rgb(var(--accent-300) / <alpha-value>)',
        },
        success: 'rgb(var(--success) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        info: 'rgb(var(--info) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(59, 130, 246, 0.3)',
      },
      borderRadius: {
        xl: '1rem',
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"IBM Plex Sans"', 'ui-sans-serif', 'system-ui'],
        body: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
