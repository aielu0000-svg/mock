import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--color-brand-primary)',
          accent: 'var(--color-brand-accent)'
        }
      }
    }
  },
  plugins: []
} satisfies Config;
