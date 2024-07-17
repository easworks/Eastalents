import { inject, Injectable } from '@angular/core';
import { CACHE } from '../common/cache';
import { sortNumber } from '../utilities/sort';
import { ApiService } from './api';

const THREE_DAY_MS = 3 * 24 * 60 * 60 * 1000;

@Injectable({
  providedIn: 'root'
})
export class CSCApi extends ApiService {
  private readonly apiUrl = 'https://api.countrystatecity.in/v1';
  private readonly apiKey = 'bHlsN1QxdWtzbkdvUVNCbGpld1YzNGl6VlExUjFsekw5cnRvN1FNVQ==';
  private readonly headers = new Headers({
    'X-CSCAPI-KEY': this.apiKey
  });

  private readonly cache = inject(CACHE)?.csc;

  async allCountries() {
    const url = `${this.apiUrl}/countries`;
    const id = url;

    const cached = this.cache && await this.cache.get<Country[]>(id, THREE_DAY_MS);
    if (cached)
      return cached;

    const countries = await fetch(url, { headers: this.headers })
      .then(this.verifyOk)
      .then<Country[]>(r => r.json())
      .catch(this.handleError);

    const details = await Promise.all(countries.map(c => this.countryDetails(c.iso2)));

    if (this.cache)
      await this.cache.set(id, details);
    return details;
  }

  async allTimezones() {
    const id = 'timezones';

    const cached = this.cache && await this.cache.get<Timezone[]>(id, THREE_DAY_MS);
    if (cached)
      return cached;

    const countries = await this.allCountries();
    const tz = countries.flatMap(c => c.timezones)
      .sort((a, b) => sortNumber(a.gmtOffset, b.gmtOffset));

    if (this.cache)
      await this.cache.set(id, tz);
    return tz;
  }

  async allStates(ciso2: string) {
    try {
      const url = `${this.apiUrl}/countries/${ciso2}/states`;
      const id = url;
      const country = await this.countryDetails(ciso2);

      const cached = this.cache && await this.cache.get<State[]>(id, THREE_DAY_MS);
      if (cached)
        return cached;

      const states = await fetch(url, { headers: this.headers })
        .then(this.verifyOk)
        .then<State[]>(r => r.json())
        .catch(this.handleError);

      states.forEach(s => {
        s.country_code = country.iso2;
        s.country_id = country.id;
      });

      if (this.cache)
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

      const cached = this.cache && await this.cache.get<City[]>(id, THREE_DAY_MS);
      if (cached)
        return cached;

      const cities = await fetch(url, { headers: this.headers })
        .then(this.verifyOk)
        .then<City[]>(r => r.json())
        .catch(this.handleError);

      if (this.cache)
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

    const cached = this.cache && await this.cache.get<Country>(id, THREE_DAY_MS);
    if (cached)
      return cached;

    const country = await fetch(url, { headers: this.headers })
      .then(this.verifyOk)
      .then<Country>(r => r.json())
      .catch(this.handleError);

    const tzData = (country.timezones as unknown as string).trim();

    country.timezones = tzData ? JSON.parse(tzData) : [];
    country.translations = JSON.parse(country.translations as unknown as string);

    if (this.cache)
      await this.cache.set(id, country);
    return country;
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
  translations: { [key: string]: string; };
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
