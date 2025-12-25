import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // RealRoots-inspired palette
        background: {
          DEFAULT: '#FAF7F5', // warm off-white/light beige
          card: '#FFFFFF',
          pastel: {
            pink: '#FFF0F3',
            blue: '#F0F4FF',
            green: '#F0FFF4',
            yellow: '#FFFBEB',
          }
        },
        primary: {
          DEFAULT: '#1A1A1A', // black for CTAs
          50: '#fdf4f5',
          100: '#fbe8eb',
          200: '#f7d5da',
          300: '#f0b3bd',
          400: '#e68599',
          500: '#d95f7a',
          600: '#c43d62',
          700: '#a62d4f',
          800: '#8a2846',
          900: '#752641',
        },
        neutral: {
          50: '#FAF7F5',
          100: '#F5F1EE',
          200: '#E8E4E0',
          300: '#D4CDC6',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        status: {
          unconfirmed: '#EF4444', // red
          confirmed: '#10B981', // green
          free: '#6B7280', // gray-green
        }
      },
      borderRadius: {
        'card': '20px',
        'lg-card': '24px',
        'pill': '999px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      },
      fontSize: {
        'heading-lg': ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-md': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-sm': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['17px', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['15px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['13px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
};
export default config;
