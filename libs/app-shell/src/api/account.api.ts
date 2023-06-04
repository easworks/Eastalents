import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountApi {
  private _bled: string[] | null = null;
  readonly blackListedDomains = async () => {
    if (!this._bled) {
      this._bled = await fetch('/assets/utils/free-email-providers.json')
        .then(r => r.json() as Promise<string[]>)
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._bled!;
  }
}