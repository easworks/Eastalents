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
      boxShadowColor: {
        DEFAULT: colors.slate[500]
      },
      borderColor: {
        DEFAULT: colors.slate[300]
      },
      colors: {
        'primary': '#4949fc',
        'primary-text': colors.white,
        'primary-dark': '#3939dc',
        'primary-light': '#6a6afd',
        'secondary': '#0f0f0f',
        'secondary-text': colors.white,
        'divider': colors.slate[300],
        'divider-text': colors.white,
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
      }
    },
  }
};
