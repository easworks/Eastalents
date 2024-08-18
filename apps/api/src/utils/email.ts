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
  static readonly compose = {
    verifyEmail: async (user: User, code: string, link: string) => {
      const tmp = await getTemplateFile('verify-email.html');
      const html = replaceVariables(tmp, [
        ['user.firstName', user.firstName],
        ['verification.code', code],
        ['verification.link', link]
      ]);

      return new MailComposer({
        to: user.email,
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
            to: user.email,
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
            to: user.email,
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
          to: user.email,
          subject: 'Welcome to Easdevhub',
          html
        });
      }
    }
  } as const;

  static async sendEmail(compose: MailComposer, senderId: string) {

    const raw = await compose.compile().build()
      .then(buf => buf.toString('base64'));

    // {
    //   const QP = await import('libqp');
    //   const x = QP.decode(Buffer.from(raw, 'base64').toString('utf-8')).toString();
    //   console.debug(x);
    // }

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