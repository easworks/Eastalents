const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

const offsetScreen = 'calc(100vh - 4rem)';

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    container: {
      center: true
    },
    screens: {
      'md': '37.5rem',
      'lg': '60rem',
      'xl': '80rem'
    },
    extend: {
      fontFamily: {
        'sans': ['Roboto', ...defaultTheme.fontFamily.sans],
        'emoji': ['Noto Color Emoji']
      },
      boxShadowColor: ({ theme }) => ({
        DEFAULT: theme('colors.black / 40%')
      }),
      borderWidth: {
        '3': 3
      },
      borderColor: {
        DEFAULT: colors.slate[300]
      },
      // 1. generated from https://uicolors.app/create
      colors: {
        // primary color original: #4949fc
        'primary': {
          '50': '#edf1ff',
          '100': '#dee5ff',
          '200': '#c3ceff',
          '300': '#9eadff',
          '400': '#7881ff',
          '500': '#4949fc',
          '600': '#4839f2',
          '700': '#3d2cd6',
          '800': '#3227ac',
          '900': '#2d2788',
          '950': '#1c174f',
        },
        // secondary color original: #0f0f0f
        'secondary': {
          '50': '#f6f6f6',
          '100': '#e7e7e7',
          '200': '#d1d1d1',
          '300': '#b0b0b0',
          '400': '#888888',
          '500': '#6d6d6d',
          '600': '#5d5d5d',
          '700': '#4f4f4f',
          '800': '#454545',
          '900': '#3d3d3d',
          '950': '#0f0f0f',
        },
        'divider': colors.slate[300],
        'warn': colors.red[600]
      },
      height: {
        'offset-screen': offsetScreen
      },
      minHeight: {
        'offset-screen': offsetScreen
      },
      maxHeight: {
        'offset-screen': offsetScreen
      },
      opacity: {
        '45': '.45'
      }
    },
  }
};
