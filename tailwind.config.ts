import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'md:col-span-1',
    'md:col-span-2',
    'md:col-span-3',
    'col-span-1',
    'col-span-3',
    'col-span-5',
    'sticky',
    'md:sticky',
    'top-0',
    'md:top-4',
    'top-4',

    'fixed',
    'bottom-10',
    'right-10',
    'z-[9999]',           
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rajdhani', 'sans-serif'],
      },
    },
  },
  
  plugins: [],
} satisfies Config;
