const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

const offsetScreen = 'calc(100vh - 5rem)';

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    container: {
      center: true
    },
    screens: ({ theme }) => theme('containers'),
    extend: {
      containers: {
        '8xl': '96rem',
        '9xl': '108rem',
        '10xl': '120rem',
      },
      fontFamily: {
        'sans': ['Nunito', ...defaultTheme.fontFamily.sans],
        'emoji': ['Noto Color Emoji']
      },
      boxShadow: {
        ...generateShadows()
      },
      boxShadowColor: ({ theme }) => ({
        DEFAULT: theme('colors.black / 0.20')
      }),
      borderWidth: {
        '3': 3
      },
      borderColor: {
        DEFAULT: colors.slate[300]
      },
      borderRadius: {
        '4xl': '2rem'
      },
      colors: ({ theme }) => {
        // generated from https://uicolors.app/create
        // primary color original: #4949fc
        const primary = {
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
        };

        // secondary color original: #0f0f0f
        const secondary = {
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
        };

        Object.assign(primary, {
          'DEFAULT': primary[500],
          'container': `hsl(from ${primary[500]} h 65 85 / <alpha-value>)`,
        })

        const surfaceSource = primary[500];

        const surface = {
          'DEFAULT': `hsl(from ${surfaceSource} h 50 96 / <alpha-value>)`,
          'dim': `hsl(from ${surfaceSource} h 40 87 / <alpha-value>)`,
          'bright': `hsl(from ${surfaceSource} h 50 98 / <alpha-value>)`,
          'container-lowest': `hsl(from ${surfaceSource} h 30 97 / <alpha-value>)`,
          'container-low': `hsl(from ${surfaceSource} h 35 95 / <alpha-value>)`,
          'container': `hsl(from ${surfaceSource} h 40 93 / <alpha-value>)`,
          'container-high': `hsl(from ${surfaceSource} h 45 91 / <alpha-value>)`,
          'container-highest': `hsl(from ${surfaceSource} h 50 89 / <alpha-value>)`,
          'inverse': `hsl(from ${surfaceSource} h 30 20 / <alpha-value>)`
        };

        const on = {
          'primary': colors.white,
          'primary-container': primary[950],
          'surface': `hsl(from ${surfaceSource} h 100 15 / <alpha-value>)`,
          'surface-variant': `hsl(from ${surfaceSource} h 25 40 / <alpha-value>)`
        }

        // on: {
        //   'surface': `hsl(from ${surfaceSource} h 100 10 / <alpha-value>)`,
        //   'surface-variant': `hsl(from ${surfaceSource} h 25 40 / <alpha-value>)`
        // },
        // 'divider': colors.slate[300],
        // 'warn': colors.red[600],

        return {
          primary,
          secondary,
          surface,
          on,
          'divider': colors.gray[300],
          'warn': colors.red,
        }
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
        '15': 0.15,
        '45': 0.45
      }
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ]
};

function generateShadows() {
  const length = 16;
  const dps = new Array(length).fill(0)
    .map((_, i) => i + 1);

  const result = {};

  const opacityMax = 20;
  const opacityMin = 4;
  const opacityRange = opacityMax - opacityMin;

  dps.forEach(dp => {
    const key = `z${dp}`;
    const layers = [
      `0px 0px ${dp * 2}px -${dp / 2}px rgb(0 0 0 / ${opacityMax - (opacityRange * (dp / length))}%)`,
      `0px ${dp}px ${dp * 2}px -0px rgb(0 0 0 / 30%)`
    ].join(', ');

    result[key] = layers;
  });

  return result;
}
