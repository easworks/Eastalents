import { Injectable, inject, isDevMode } from '@angular/core';
import { ENVIRONMENT } from '../environment';
import { Cached, createCache, isFresh } from './cache';

@Injectable({
  providedIn: 'root'
})
export class CSCApi {
  private readonly apiUrl = 'https://api.countrystatecity.in/v1';
  private readonly apiKey = inject(ENVIRONMENT).cscApiKey;
  private readonly headers = new Headers({
    'X-CSCAPI-KEY': this.apiKey
  });

  private readonly devMode = isDevMode();
  private readonly cache = createCache('csc-cache');

  async getAllCountries() {
    const url = `${this.apiUrl}/countries`;
    const id = url;
    const cached = await this.cache.get<Cached<Country[]>>(id);

    if (cached && isFresh(cached))
      return cached.data;

    const res = await fetch(url, { headers: this.headers });
    await this.handleErrorsIfAny(res);

    const countries = await res.json() as Country[];

    const details = await Promise.all(countries.map(c => this.countryDetails(c.iso2)))

    await this.cache.set(id, details);
    return details;
  }

  async countryDetails(iso2: string) {
    const url = `${this.apiUrl}/countries/${iso2}`;
    const id = url;

    const cached = await this.cache.get<Cached<Country>>(id);
    if (cached && isFresh(cached))
      return cached.data;

    const res = await fetch(url, { headers: this.headers });
    await this.handleErrorsIfAny(res);

    const country = await res.json() as Country;
    country.timezones = JSON.parse(country.timezones as unknown as string);
    country.translations = JSON.parse(country.translations as unknown as string);
    await this.cache.set(id, country);
    return country;
  }

  private async handleErrorsIfAny(response: Response) {
    if (!response.ok) {
      const body = await response.json();
      if (this.devMode) {
        console.error(body);
      }
      throw body;
    }
  }

}

export interface Country {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  currency: string;
  phonecode: string;
  emoji: string;
  timezones: Timezone[];
  translations: { [key: string]: string };
}

interface Timezone {
  zoneName: string;
  gmtOffset: number;
  gmtOffsetName: string;
  abbreviation: string;
  tzName: string;
}
