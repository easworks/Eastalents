import { Meta, StoryObj } from '@storybook/angular';
import { ButtonsShowcaseComponent } from './buttons-showcase.component';

const meta: Meta<ButtonsShowcaseComponent> = {
  title: 'Buttons',
  component: ButtonsShowcaseComponent,
  //👇 Our exports that end in "Data" are not stories.
  tags: ['autodocs'],
  args: {
  },
};

export default meta;


export const Default: StoryObj<ButtonsShowcaseComponent> = {
  args: {

  },
};