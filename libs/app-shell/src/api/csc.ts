import { Injectable, inject, isDevMode } from '@angular/core';
import { ENVIRONMENT } from '../environment';
import { Cached, createCache, isFresh } from './cache';
import { generateLoadingState } from '../state/loading';

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

  readonly loading = generateLoadingState<[
    'country',
    'state',
    'city'
  ]>();

  async allCountries() {
    this.loading.add('country');

    try {
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
    finally {
      this.loading.delete('country');
    }
  }

  async allStates(ciso2: string) {
    this.loading.add('state');

    try {
      const url = `${this.apiUrl}/countries/${ciso2}/states`;
      const id = url;

      const cached = await this.cache.get<Cached<State[]>>(id);
      if (cached && isFresh(cached, THREE_DAY_MS))
        return cached.data;

      const res = await fetch(url, { headers: this.headers });
      await this.handleErrorsIfAny(res);

      const states = await res.json() as State[];

      const details = await Promise.all(states.map(s => this.stateDetails(ciso2, s.iso2)));

      await this.cache.set(id, details);
      return details;
    }
    finally {
      this.loading.delete('state');
    }
  }

  async allCities(ciso2: string, siso2?: string) {
    const isChildOperation = this.loading.has('city')();
    if (!isChildOperation)
      this.loading.add('city');

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
    finally {
      if (!isChildOperation)
        this.loading.delete('city');
    }
  }

  async countryDetails(ciso2: string) {
    const isChildOperation = this.loading.has('country')();
    if (!isChildOperation)
      this.loading.add('country');

    try {
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
    finally {
      if (!isChildOperation)
        this.loading.delete('country');
    }

  }

  async stateDetails(ciso2: string, siso2: string) {
    const isChildOperation = this.loading.has('state')();
    if (!isChildOperation)
      this.loading.add('state');

    try {
      if (siso2.length !== 2) {
        const parts = siso2.split('-');
        ciso2 = parts[0];
        siso2 = parts[1];
      }

      const url = `${this.apiUrl}/countries/${ciso2}/states/${siso2}`;
      const id = url;

      const cached = await this.cache.get<Cached<State>>(id);
      if (cached && isFresh(cached, THREE_DAY_MS))
        return cached.data;

      const res = await fetch(url, { headers: this.headers });
      await this.handleErrorsIfAny(res);

      const state = await res.json() as State;
      await this.cache.set(id, state);
      return state;
    }
    finally {
      if (!isChildOperation)
        this.loading.delete('state');
    }
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

interface Timezone {
  zoneName: string;
  gmtOffset: number;
  gmtOffsetName: string;
  abbreviation: string;
  tzName: string;
}
