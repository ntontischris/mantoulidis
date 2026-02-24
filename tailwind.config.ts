import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Alumni Connect brand palette
        primary: {
          DEFAULT: '#1B3A5C',
          foreground: '#FFFFFF',
          50: '#E8EEF4',
          100: '#C5D4E4',
          200: '#9EB8D1',
          300: '#769BBD',
          400: '#5585AD',
          500: '#1B3A5C',
          600: '#163050',
          700: '#112643',
          800: '#0C1C36',
          900: '#071229',
        },
        secondary: {
          DEFAULT: '#2E75B6',
          foreground: '#FFFFFF',
          50: '#EBF3FB',
          100: '#C9DFF4',
          200: '#A5CAEC',
          300: '#80B5E5',
          400: '#5CA0DD',
          500: '#2E75B6',
          600: '#26609A',
          700: '#1D4C7E',
          800: '#143862',
          900: '#0B2446',
        },
        accent: {
          DEFAULT: '#E8B931',
          foreground: '#1A1A2E',
          50: '#FDF8E7',
          100: '#FAEEBC',
          200: '#F6E291',
          300: '#F2D666',
          400: '#EDCA3B',
          500: '#E8B931',
          600: '#C99E28',
          700: '#AA831F',
          800: '#8B6816',
          900: '#6C4D0D',
        },
        // Semantic colors
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        success: {
          DEFAULT: '#27AE60',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#F39C12',
          foreground: '#1A1A2E',
        },
        destructive: {
          DEFAULT: '#E74C3C',
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['clamp(2.5rem, 5vw, 3.75rem)', { lineHeight: '1.1', fontWeight: '800' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
      },
    },
  },
  plugins: [],
}

export default config
