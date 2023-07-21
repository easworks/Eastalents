import { Injectable, inject, isDevMode } from '@angular/core';
import { ENVIRONMENT } from '../environment';
import { sortNumber } from '../utilities/sort';
import { Cached, createCache, isFresh } from './cache';

const THREE_DAY_MS = 3 * 24 * 60 * 60 * 1000;

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

  async allCountries() {
    const url = `${this.apiUrl}/countries`;
    const id = url;

    const cached = await this.cache.get<Cached<Country[]>>(id);
    if (cached && isFresh(cached, THREE_DAY_MS))
      return cached.data;

    const res = await fetch(url, { headers: this.headers });
    await this.handleErrorsIfAny(res);

    const countries = await res.json() as Country[];

    const details = await Promise.all(countries.map(c => this.countryDetails(c.iso2)))

    await this.cache.set(id, details);
    return details;
  }

  async allTimezones() {
    const id = 'timezones';

    const cached = await this.cache.get<Cached<Timezone[]>>(id);
    if (cached && isFresh(cached, THREE_DAY_MS))
      return cached.data;

    const countries = await this.allCountries();
    const tz = countries.flatMap(c => c.timezones)
      .sort((a, b) => sortNumber(a.gmtOffset, b.gmtOffset));

    await this.cache.set(id, tz);
    return tz;
  }

  async allStates(ciso2: string) {
    try {
      const url = `${this.apiUrl}/countries/${ciso2}/states`;
      const id = url;
      const country = await this.countryDetails(ciso2);

      const cached = await this.cache.get<Cached<State[]>>(id);
      if (cached && isFresh(cached, THREE_DAY_MS))
        return cached.data;

      const res = await fetch(url, { headers: this.headers });
      await this.handleErrorsIfAny(res);

      const states = await res.json() as State[];
      states.forEach(s => {
        s.country_code = country.iso2;
        s.country_id = country.id;
      });

      await this.cache.set(id, states);
      return states;
    }
    catch (e) {
      console.error(e);
      return [];
    }
  }

  async allCities(ciso2: string, siso2?: string) {
    try {
      const url = siso2 ?
        `${this.apiUrl}/countries/${ciso2}/states/${siso2}/cities` :
        `${this.apiUrl}/countries/${ciso2}/cities`;
      const id = url;

      const cached = await this.cache.get<Cached<City[]>>(id);
      if (cached && isFresh(cached, THREE_DAY_MS))
        return cached.data;

      const res = await fetch(url, { headers: this.headers });
      await this.handleErrorsIfAny(res);

      const cities = await res.json() as City[];
      await this.cache.set(id, cities);
      return cities;
    }
    catch (e) {
      console.error(e);
      return [];
    }
  }

  private async countryDetails(ciso2: string) {
    const url = `${this.apiUrl}/countries/${ciso2}`;
    const id = url;

    const cached = await this.cache.get<Cached<Country>>(id);
    if (cached && isFresh(cached, THREE_DAY_MS))
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

export interface State {
  id: number;
  name: string;
  iso2: string;

  country_code: string;
  country_id: number;
}

export interface City {
  id: number;
  name: string;
}

export interface Timezone {
  zoneName: string;
  gmtOffset: number;
  gmtOffsetName: string;
  abbreviation: string;
  tzName: string;
}
