const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config['safelist']} */
const safelist = [
  {
    pattern: /^-?(?:p|m|gap)[xy]?-/,
  },
  {
    pattern:
      /^(?:bg|text|flex|grid|justify|align|font|object|rounded|shadow|overflow|h|w)-/,
  },
];

const twPreset = require('../../libs/shared/styles/src/tailwind.config');
const glob = '**/!(*.stories|*.spec).{ts,html}';

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [twPreset],
  content: [
    join(__dirname, 'src', glob),
    ...createGlobPatternsForDependencies(__dirname, glob)
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
  /** uncomment the below line when you want to build the safelist into a
   *  file with tailwind cli
   * last build took 4200-4400 ms*/

  // safelist
};
