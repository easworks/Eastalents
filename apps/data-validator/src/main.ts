import { parse } from '@easworks/app-shell/state/parsers';
import { getDomains, validateData } from './domain';

async function main() {
  console.log('reading input');
  const techInput = import(new URL('./tech.json', import.meta.url).toString(), { assert: { type: 'json' } })
    .then(m => m.default);
  const softwareInput = import(new URL('./software.json', import.meta.url).toString(), { assert: { type: 'json' } })
    .then(m => m.default);
  const domains = getDomains();



  console.log('validating tech.json');
  const techOutput = parse.techDto(await techInput, true);

  console.log('validating software.json');
  const softwareOutput = parse.softwareDto(await softwareInput, true, techOutput);

  console.log('validating domains');
  validateData(await domains, softwareOutput);

  console.log('finished');
};

await main();
