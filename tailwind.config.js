/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        gray: {
          100: '#FAFAFA',
          200: '#E1E1E6',
          300: '#92929A',
          400: '#585860',
          500: '#2A2A2D',
          600: '#1C1C22',
          700: '#121216',
          800: '#0B0B0E',
        },
        danger: {
          light: '#E77482',
          low: '#360F14',
        },
        alert: {
          light: '#DEB55E',
          low: '#281F0B',
        },
        background: {
          section: '#41D0D8',
          sectionLow: '#0A2324',
        },
        green: {
          light: '#71D697',
          base: '#30A65D',
        },
      },
      fontFamily: {
        'heading': ['Sora_700Bold', 'sans-serif'],
        'body': ['Inter_400Regular', 'sans-serif'],
        'label-lg': ['Inter_600SemiBold', 'sans-serif'],
        'label-md': ['Inter_600SemiBold', 'sans-serif'],
        'label-sm': ['Inter_600SemiBold', 'sans-serif'],
        'text-md': ['Inter_400Regular', 'sans-serif'],
        'text-sm': ['Inter_400Regular', 'sans-serif'],
        'text-xs': ['Inter_400Regular', 'sans-serif'],
        'heading-lg': ['Sora_700Bold', 'sans-serif'],
        'heading-sm': ['Sora_700Bold', 'sans-serif'],
      },
      fontSize: {
        'heading-lg': ['20px', { lineHeight: '130%', fontWeight: '700' }],
        'heading-sm': ['14px', { lineHeight: '130%', fontWeight: '700' }],
        'label-lg': ['20px', { lineHeight: '150%', fontWeight: '600' }],
        'label-md': ['16px', { lineHeight: '150%', fontWeight: '600' }],
        'label-sm': ['14px', { lineHeight: '150%', fontWeight: '600' }],
        'text-md': ['16px', { lineHeight: '150%', fontWeight: '400' }],
        'text-sm': ['14px', { lineHeight: '150%', fontWeight: '400' }],
        'text-xs': ['12px', { lineHeight: '150%', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
};
