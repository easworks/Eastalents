const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

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
  plugins: [],
};
