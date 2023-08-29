import { Injectable, inject } from '@angular/core';
import { SWManagementService } from './sw.manager';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwSocketService {
  private readonly wb = inject(SWManagementService).wb;

  send<T>(event: string, payload: T, response?: string, broadcast = false) {
    return this.wb.messageSW({ type: 'SOCKET', event, payload, response, broadcast });
  }

  listen<T>(event: string, map = (result: any) => result as T) {
    const $ = new Subject<T>();
    this.wb.addEventListener('message', (ev) => {
      if (ev.data.type === 'SOCKET' && ev.data.event === event)
        $.next(map(ev.data.payload));
    });

    return $;
  }
}
