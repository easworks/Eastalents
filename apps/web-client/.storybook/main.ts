import { StorybookConfigVite } from '@storybook/builder-vite';
import type { StorybookConfig } from '@storybook/types';

const config: StorybookConfig & StorybookConfigVite = {
  stories: [
    '../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    '../../../libs/app-shell/src/**/*.stories.ts'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/angular',
};

export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/recipes/storybook/custom-builder-configs
