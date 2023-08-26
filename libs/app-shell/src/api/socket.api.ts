import { inject } from '@angular/core';
import { SWManagementService } from '../services/sw.manager';

export class SocketApi {
  private readonly wb = inject(SWManagementService).wb;
  protected send(name: string, args: unknown, response?: string) {
    return this.wb.messageSW({ type: 'SOCKET', payload: { name, response, args } });
  }
}
