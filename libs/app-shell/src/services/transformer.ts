import { Injectable } from '@angular/core';
import type * as hast from 'hast';
import { messageWorker } from '../utilities/message-worker';

@Injectable({
  providedIn: 'root'
})
export class TransformerService {
  private readonly worker = new Worker(new URL('../transformer/transformer.worker', import.meta.url));

  readonly md = {
    html: {
      transform: (input: string) =>
        messageWorker<hast.Root>(this.worker, {
          type: 'md.html.transform',
          payload: { input }
        }),
      stringify: (input: hast.Root) =>
        messageWorker<string>(this.worker, {
          type: 'md.html.stringify',
          payload: { input }
        })
    }
  } as const;
}
