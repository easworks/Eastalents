import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root'
})
export class AccountApi extends ApiService {
  private _bled: string[] | null = null;
  readonly blackListedDomains = async () => {
    if (!this._bled) {
      this._bled = await firstValueFrom(this.http.get<string[]>('/assets/utils/free-email-providers.json'))
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._bled!;
  }
}