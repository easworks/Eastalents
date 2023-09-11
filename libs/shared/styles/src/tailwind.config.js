const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

const offsetScreen = 'calc(100vh - 4rem)';

function buildPalette(name, shadeNumbers) {
  const result = {};
  shadeNumbers.forEach(s => {
    const shade = `${name}-${s}`
    result[shade] = `var(--${shade})`;
  });
  return result;
}

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
        ...buildPalette(
          'primary',
          [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
        ),
        ...buildPalette(
          'secondary',
          [600]
        ),
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
      }
    },
  }
};
