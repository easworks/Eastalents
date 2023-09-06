/// <reference lib="webworker" />

import { mdToHtml } from './md-to-html';

declare const self: DedicatedWorkerGlobalScope;

self.addEventListener('message', ({ data, ports }) => {

  process(data)
    .then(result => ports[0].postMessage(result));
});

async function process(data: any) {
  switch (data.type) {
    case 'md.html.transform': {
      const parsed = mdToHtml.parse(data.payload.input);
      const transformed = mdToHtml.run(parsed);
      return transformed;
    };
    case 'md.html.stringify': {
      return mdToHtml.stringify(data.payload.input);
    }
    default: return undefined;
  }
}
