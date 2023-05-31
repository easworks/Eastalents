const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    container: {
      center: true
    },
    screens: {
      'sm': '37.5rem',
      'md': '60rem',
      'lg': '80rem'
    },
    extend: {
      boxShadowColor: {
        DEFAULT: colors.gray[500]
      },
      borderColor: {
        DEFAULT: colors.gray[300]
      },
      colors: {
        'primary': '#4949fc',
        'primary-text': colors.white,
        'primary-dark': '#2929dc',
        'primary-light': '#6a6afd',
        'divider': colors.gray[300],
        'divider-text': colors.white,
        'warn': colors.red[600]
      }
    },
  }
};
