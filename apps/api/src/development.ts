import { CountryBillingDescriptor, StripeTaxIDDescriptor } from '@easworks/models/billing';
import { token_ref_schema } from '@easworks/mongodb/schema/auth';
import { client_profile_schema } from '@easworks/mongodb/schema/client-profile';
import { user_credential_schema } from '@easworks/mongodb/schema/identity-provider';
import { oauth_code_schema } from '@easworks/mongodb/schema/oauth';
import { permission_record_schema } from '@easworks/mongodb/schema/permission-record';
import { talent_profile_schema } from '@easworks/mongodb/schema/talent-profile';
import { user_schema } from '@easworks/mongodb/schema/user';
import { EAS_EntityManager } from '@easworks/mongodb/types';
import { readFile } from 'fs/promises';
import { FastifyZodPluginAsync } from 'server-side/utils/fastify-zod';
import { z } from 'zod';
import { authHook } from './auth/hooks';
import { environment } from './environment';

export const developmentHandlers: FastifyZodPluginAsync = async server => {

  if (environment.id === 'production')
    return;

  server.post('/delete-account',
    { 'onRequest': authHook() },
    async (req) => {
      const id = req.ctx.auth!._id;
      if (!id) throw new Error();

      return deleteUser(req.ctx.em, id);
    });

  server.post('/convert-billing-field-csv',
    async (req) => {

      const trimCells = z.array(z.string().trim().transform(s => s === 'N/A' ? null : s));

      const countries = {} as Record<string, CountryBillingDescriptor>;

      const lines = (req.body as string).split('\r\n');
      for (const line of lines) {
        if (!line)
          continue;

        const cells = trimCells.parse(line.split(','));

        const row = {
          enumeration: cells[0]!,
          iso2: cells[2]!,
          companyReg: {
            fieldName: cells[3]
          },
          taxId: {
            fieldName: cells[5]
          },
          gst: {
            fieldName: cells[7]
          },
          bankAccount: {
            fieldName: cells[9]
          },
          bankCode: {
            fieldName: cells[11]
          },
        };

        if (!(row.iso2 in countries)) {
          const c: CountryBillingDescriptor = {
            iso2: row.iso2,
            bank: {
              account: row.bankAccount.fieldName,
              code: row.bankCode.fieldName
            },
            business: []
          };

          countries[c.iso2] = c;
        }

        const country = countries[row.iso2];

        country.business.push({
          enumeration: row.enumeration,
          company: row.companyReg.fieldName,
          tax: row.taxId.fieldName,
          gst: row.gst.fieldName
        });
      }

      return Object.values(countries);
    });

  server.post('/tax-enumerations-not-supported-by-stripe',
    async () => {
      const stripe = JSON.parse(await readFile('libs/shared/assets/src/utils/stripe-tax-id.json', { encoding: 'utf-8' })) as StripeTaxIDDescriptor[];

      const ours = JSON.parse(await readFile('libs/shared/assets/src/utils/tax-id.json', { encoding: 'utf-8' })) as CountryBillingDescriptor[];

      const stripeIds = (() => {
        const list = stripe.map(s => s.externalType);
        return new Set(list);
      })();;

      const ourIds = (() => {
        const list = ours.flatMap(c => c.business.map(b => b.enumeration));
        return [...new Set(list)];
      })();

      const invalid = ourIds.filter(id => !stripeIds.has(id));

      return invalid;
    }
  );
};

export async function deleteUser(em: EAS_EntityManager, _id: string) {
  const user = await em.findOneOrFail(user_schema, _id);

  await Promise.all([
    em.nativeDelete(token_ref_schema, { user }),
    em.nativeDelete(oauth_code_schema, { user }),
    em.nativeDelete(user_credential_schema, { user }),
    em.nativeDelete(permission_record_schema, { user }),
    em.nativeDelete(talent_profile_schema, { user }),
    em.nativeDelete(client_profile_schema, { user }),
    em.nativeDelete(user_schema, user)
  ]);
}