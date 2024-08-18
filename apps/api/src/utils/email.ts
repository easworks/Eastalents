import path from 'node:path';
import fs from 'node:fs/promises';
import { User } from 'models/user';

function getTemplateFile(filename: string) {
  const templateFile = path.resolve(import.meta.filename, `../assets/templates/${filename}`);
  return fs.readFile(templateFile, { encoding: 'utf-8' });
}

function replaceVariables(template: string, inputs: [string, string][]) {
  return inputs.reduce((state, current) => {
    return state.replaceAll(`{{ ${current[0]} }}`, current[1]);
  }, template);
}

export const emailTemplates = {
  verifyEmail: async (user: User, link: string) => {
    return replaceVariables(
      await getTemplateFile(`verify-email.html`),
      [
        ['user.firstName', user.firstName],
        ['verification.link', link]
      ]
    );
  },
  welcome: {
    easworks: {
      talent: async (user: User) => {
        return replaceVariables(
          await getTemplateFile('welcome/talent.html'),
          [
            ['user.firstName', user.firstName],
          ]
        );
      },
      employer: async (user: User) => {
        return replaceVariables(
          await getTemplateFile('welcome/employer.html'),
          [
            ['user.firstName', user.firstName],
          ]
        );
      }
    },
    easdevhub: async (user: User) => {
      return replaceVariables(
        await getTemplateFile('welcome/easdevhub.html'),
        [
          ['user.firstName', user.firstName],
        ]
      );
    }
  }
};