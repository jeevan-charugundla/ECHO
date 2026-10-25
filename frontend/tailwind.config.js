/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F8FA',
        surface: '#FFFFFF',
        primary: '#172033',
        secondary: '#5E6A82',
        muted: '#8C9BAE',
        'border-main': '#E5E9F0',
        'border-subtle': '#EDF1F7',
        navy: {
          950: '#0B111E',
          900: '#111827',
          800: '#172033',
          700: '#26344C',
          600: '#384865',
        },
        slate: {
          750: '#2A3649',
          650: '#475569',
        },
        electric: {
          50: '#EEF3FF',
          100: '#DDE7FE',
          200: '#BCCFFE',
          300: '#90B0FD',
          400: '#5F8AFC',
          500: '#315EFB',
          600: '#224DE8',
          700: '#183CBF',
          800: '#17339B',
        },
        crimson: {
          50: '#FFF5F5',
          100: '#FFE3E3',
          500: '#FA5252',
          600: '#E03131',
          700: '#C92A2A',
        },
        amber: {
          50: '#FFF9DB',
          100: '#FFF3BF',
          500: '#F59F00',
          600: '#D97706',
          700: '#B45309',
        },
        emerald: {
          50: '#EBFBEE',
          100: '#D3F9D8',
          500: '#2B8A3E',
          600: '#059669',
          700: '#047857',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        serif: ['Newsreader', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(16, 24, 40, 0.04)',
        'card': '0 1px 3px 0 rgba(16, 24, 40, 0.05), 0 1px 2px -1px rgba(16, 24, 40, 0.05)',
        'elevated': '0 4px 6px -1px rgba(16, 24, 40, 0.07), 0 2px 4px -2px rgba(16, 24, 40, 0.05)',
        'modal': '0 20px 25px -5px rgba(16, 24, 40, 0.1), 0 8px 10px -6px rgba(16, 24, 40, 0.1)',
      },
      borderRadius: {
        'DEFAULT': '0.5rem',
        'sm': '0.375rem',
        'md': '0.5rem',
        'lg': '0.625rem',
        'xl': '0.75rem',
      }
    },
  },
  plugins: [],
}
