import { parse } from '@easworks/app-shell/state/parsers';

async function main() {

  // fetchAndProcessDomains();

  console.log('reading tech.json');
  const techInput = await import(new URL('./tech.json', import.meta.url).toString(), { assert: { type: 'json' } })
    .then(m => m.default);

  console.log('validating tech.json');
  const techOutput = parse.techDto(techInput, true);


  console.log('reading software.json');
  const softwareInput = await import(new URL('./software.json', import.meta.url).toString(), { assert: { type: 'json' } })
    .then(m => m.default);

  console.log('validating software.json');
  const softwareOutput = parse.softwareDto(softwareInput, true, techOutput);

  console.debug(softwareOutput);

};

await main();
