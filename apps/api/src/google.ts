import { gmail } from '@googleapis/gmail';
import { GoogleAuth, JWT } from 'google-auth-library';

export const easGoogle = (() => {
  const scopes = [
    'https://www.googleapis.com/auth/cloud-platform'
  ].join(' ');

  const auth = (() => {
    const auth = new GoogleAuth({ scopes });

    const getClient = async () => {
      const client = await auth.getClient();
      if (!(client instanceof JWT))
        throw new Error('invalid operation');

      return client;
    };

    const forGmail = async (senderId: string) => {
      const client = await getClient();
      const delegated = client.createScoped('https://mail.google.com');
      delegated.subject = senderId;
      return delegated;
    };

    return {
      getClient,
      forGmail
    } as const;
  })();

  return {
    auth,
    gmail: gmail('v1')
  } as const;
})();