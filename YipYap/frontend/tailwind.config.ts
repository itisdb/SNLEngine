import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        light: {
          primary: '#e0e0e0',
          secondary: '#f5f5f5',
          accent: '#ffffff',
          text: '#333333',
        },
        dark: {
          primary: '#1a1a1a',
          secondary: '#2a2a2a',
          accent: '#000000',
          text: '#ffffff',
        },
      },
      boxShadow: {
        'neumorphic-light': '9px 9px 16px #d1d1d1, -9px -9px 16px #ffffff',
        'neumorphic-dark': '9px 9px 16px #1a1a1a, -9px -9px 16px #2a2a2a',
      },
    },
  },
  plugins: [],
}
export default config
