import { gmail } from '@googleapis/gmail';
import { GoogleAuth, JWT } from 'google-auth-library';
import { environment } from './environment';

export const easGoogle = (async () => {
  const scopes = [
    'https://www.googleapis.com/auth/cloud-platform'
  ].join(' ');

  const auth = new GoogleAuth({ scopes });
  const client = await auth.getClient();

  const mail = (() => {
    if (!(client instanceof JWT))
      throw new Error('invalid operation');

    const delegated = client.createScoped('https://mail.google.com');
    delegated.subject = environment.gmail.sender;

    return gmail({ version: 'v1', auth: delegated });
  })();

  return {
    auth,
    mail
  } as const;
})();