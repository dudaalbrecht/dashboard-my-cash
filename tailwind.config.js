/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'md': '768px',   // Tablet
        'lg': '1280px',  // Desktop
        'xl': '1920px',  // Wide / 4K
      },
      colors: {
        // Neutral colors
        neutral: {
          0: 'var(--color-neutral-0)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          1100: 'var(--color-neutral-1100)',
        },
        // Primary colors
        primary: {
          500: 'var(--color-primary-500)',
        },
        // Secondary colors
        secondary: {
          50: 'var(--color-secondary-50)',
          900: 'var(--color-secondary-900)',
        },
        // Surface colors
        surface: {
          500: 'var(--color-surface-500)',
        },
        // Background colors
        background: {
          400: 'var(--color-background-400)',
        },
        // Brand colors
        brand: {
          700: 'var(--color-brand-700)',
        },
        // Semantic colors
        blue: {
          600: 'var(--color-blue-600)',
        },
        green: {
          600: 'var(--color-green-600)',
        },
        red: {
          600: 'var(--color-red-600)',
        },
      },
      spacing: {
        // Design system spacing tokens
        'space-0': 'var(--space-0)',
        'space-8': 'var(--space-8)',
        'space-12': 'var(--space-12)',
        'space-16': 'var(--space-16)',
        'space-20': 'var(--space-20)',
        'space-24': 'var(--space-24)',
        'space-32': 'var(--space-32)',
        'space-56': 'var(--space-56)',
      },
      borderRadius: {
        // Design system shape tokens
        'shape-2': 'var(--shape-2)',
        'shape-20': 'var(--shape-20)',
        'shape-100': 'var(--shape-100)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        // Heading sizes
        'heading-medium': ['28px', { lineHeight: '36px', fontWeight: '700' }],
        'heading-small': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'heading-x-small': ['20px', { lineHeight: '28px', fontWeight: '700' }],
        // Label sizes
        'label-large': ['18px', { lineHeight: '24px', fontWeight: '600', letterSpacing: '0.3px' }],
        'label-medium': ['16px', { lineHeight: '20px', fontWeight: '600', letterSpacing: '0.3px' }],
        'label-small': ['14px', { lineHeight: '16px', fontWeight: '600', letterSpacing: '0.3px' }],
        'label-x-small': ['12px', { lineHeight: '16px', fontWeight: '600', letterSpacing: '0.3px' }],
        // Paragraph sizes
        'paragraph-large': ['18px', { lineHeight: '28px', fontWeight: '400', letterSpacing: '0.3px' }],
        'paragraph-small': ['14px', { lineHeight: '20px', fontWeight: '400', letterSpacing: '0.3px' }],
        'paragraph-x-small': ['12px', { lineHeight: '20px', fontWeight: '400', letterSpacing: '0.3px' }],
      },
      boxShadow: {
        'card': '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        'elevated': '0px 8px 16px 0px rgba(0, 0, 0, 0.1)',
      },
      maxWidth: {
        'container-desktop': '1400px',
        'container-wide': '1600px',
      },
    },
  },
  plugins: [],
}
