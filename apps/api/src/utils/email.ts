import { User } from 'models/user';
import fs from 'node:fs/promises';
import path from 'node:path';
import MailComposer from 'nodemailer/lib/mail-composer/index.js';
import { GoogleApiError } from 'server-side/errors/definitions';
import { easGoogle } from './google';

function getTemplateFile(filename: string) {
  const templateFile = path.resolve(import.meta.filename, `../assets/templates/${filename}`);
  return fs.readFile(templateFile, { encoding: 'utf-8' });
}

function replaceVariables(template: string, inputs: [string, string][]) {
  return inputs.reduce((state, current) => {
    return state.replaceAll(`{{ ${current[0]} }}`, current[1]);
  }, template);
}

export class EmailSender {
  static readonly from = {
    easworks: {
      support: 'EASWORKS support@easworks.com',
      hello: 'EASWORKS hello@easworks.com'
    },
    easdevhub: {
      support: 'EASDEVHUB support@easdevhub.com',
      hello: 'EASDEVHUB hello@easdevhub.com'
    }
  };

  static readonly compose = {
    resetPassword: async (user: User, code: string) => {
      const tmp = await getTemplateFile('password-reset.html');
      const html = replaceVariables(tmp, [
        ['user.firstName', user.firstName],
        ['verification.code', code]
      ]);

      return new MailComposer({
        subject: 'Reset Password',
        html
      });
    },
    verifyEmail: async (firstName: string, code: string) => {
      const tmp = await getTemplateFile('verify-email.html');
      const html = replaceVariables(tmp, [
        ['user.firstName', firstName],
        ['verification.code', code]
      ]);

      return new MailComposer({
        subject: 'Email Verification',
        html
      });
    },
    welcome: {
      easworks: {
        talent: async (user: User) => {
          const tmp = await getTemplateFile('welcome/talent.html');
          const html = replaceVariables(tmp, [
            ['user.firstName', user.firstName],
          ]);

          return new MailComposer({
            subject: 'Welcome to Easworks',
            html
          });
        },
        employer: async (user: User) => {
          const tmp = await getTemplateFile('welcome/employer.html');
          const html = replaceVariables(tmp, [
            ['user.firstName', user.firstName],
          ]);

          return new MailComposer({
            subject: 'Welcome to Easworks',
            html
          });
        },
      },
      easdevhub: async (user: User) => {
        const tmp = await getTemplateFile('welcome/easdevhub.html');
        const html = replaceVariables(tmp, [
          ['user.firstName', user.firstName],
        ]);

        return new MailComposer({
          subject: 'Welcome to Easdevhub',
          html
        });
      }
    }
  } as const;

  static async sendEmail(compose: MailComposer, senderId: string) {

    const raw = await compose.compile().build()
      .then(buf => buf.toString('base64'));

    const auth = await easGoogle.auth.forGmail(senderId);

    await easGoogle.gmail.users.messages.send({
      auth,
      userId: senderId,
      requestBody: { raw },
    }).catch(err => {
      throw new GoogleApiError(err);
    });
  }
}