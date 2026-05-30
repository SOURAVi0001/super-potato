// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf6ee',
          100: '#f5e9d6',
          200: '#e8cfb0',
          400: '#c49a6c',
          600: '#8b6f47',
          800: '#5c3d1e',
          900: '#3d2712',
        },
        stone: {
          50:  '#faf9f7',
          100: '#f2ede6',
          200: '#e5ddd2',
          300: '#d4c9b8',
          400: '#b8a898',
          500: '#9a8878',
          600: '#7a6858',
          700: '#5c4e40',
          800: '#3d3028',
          900: '#251c14',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        xs:  ['11px', { lineHeight: '16px' }],
        sm:  ['13px', { lineHeight: '20px' }],
        base:['14px', { lineHeight: '22px' }],
        md:  ['15px', { lineHeight: '24px' }],
        lg:  ['17px', { lineHeight: '26px' }],
        xl:  ['20px', { lineHeight: '28px' }],
        '2xl':['24px',{ lineHeight: '32px' }],
      },
      borderRadius: {
        sm:  '3px',
        DEFAULT: '4px',
        md:  '6px',
        lg:  '8px',
        xl:  '12px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(61, 40, 18, 0.06), 0 1px 2px rgba(61, 40, 18, 0.04)',
        input:'0 0 0 3px rgba(139, 111, 71, 0.15)',
        none: 'none',
      },
    },
  },
  plugins: [],
};

export default config;
