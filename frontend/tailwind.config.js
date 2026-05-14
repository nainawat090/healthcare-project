/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary teal-cyan palette
        primary: {
          50:  '#f0fdfc',
          100: '#ccfbf5',
          200: '#99f6ec',
          300: '#5eead8',
          400: '#2dd4be',
          500: '#14b8a3',
          600: '#0d9488',
          700: '#0f766d',
          800: '#115e57',
          900: '#134e49',
        },
        // Emergency red
        emergency: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
        },
        // Warning amber
        warning: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        // Dark background
        dark: {
          900: '#070e16',
          800: '#0d1825',
          700: '#121f30',
          600: '#1a2d42',
          500: '#1e3448',
          400: '#243e56',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Syne"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b8a3' fill-opacity='0.04'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'hero-gradient': 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(20,184,163,0.15), transparent)',
        'card-gradient': 'linear-gradient(135deg, rgba(20,184,163,0.08) 0%, rgba(13,148,136,0.04) 100%)',
      },
      boxShadow: {
        'glow':      '0 0 20px rgba(20,184,163,0.3)',
        'glow-lg':   '0 0 40px rgba(20,184,163,0.2)',
        'emergency': '0 0 20px rgba(244,63,94,0.4)',
        'card':      '0 4px 24px rgba(0,0,0,0.3)',
        'card-hover':'0 8px 40px rgba(0,0,0,0.5)',
      },
      animation: {
        'pulse-slow':  'pulse 3s ease-in-out infinite',
        'float':       'float 6s ease-in-out infinite',
        'scan':        'scan 2s linear infinite',
        'ping-slow':   'ping 2s cubic-bezier(0,0,0.2,1) infinite',
        'heartbeat':   'heartbeat 1.2s ease-in-out infinite',
        'slide-up':    'slideUp 0.5s ease-out',
        'fade-in':     'fadeIn 0.4s ease-out',
        'glow-pulse':  'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%':      { transform: 'scale(1.15)' },
          '28%':      { transform: 'scale(1)' },
          '42%':      { transform: 'scale(1.1)' },
          '56%':      { transform: 'scale(1)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(20,184,163,0.3)' },
          '50%':      { boxShadow: '0 0 30px rgba(20,184,163,0.6)' },
        },
      },
    },
  },
  plugins: [],
};
