import { Meta, StoryObj } from '@storybook/angular';
import { ColorsShowcaseComponent } from './colors-showcase.component';

const meta: Meta<ColorsShowcaseComponent> = {
  title: 'Colors',
  component: ColorsShowcaseComponent,
  //👇 Our exports that end in "Data" are not stories.
  tags: ['autodocs'],
  args: {
  },
};

export default meta;


export const Default: StoryObj<ColorsShowcaseComponent> = {
  args: {

  },
};