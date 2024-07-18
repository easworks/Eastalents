import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { isBrowser } from '../utilities/platform-type';

@Injectable({
  providedIn: 'root'
})
export class CSCApi {
  private readonly apiUrl = 'https://api.countrystatecity.in/v1';
  private readonly apiKey = 'bHlsN1QxdWtzbkdvUVNCbGpld1YzNGl6VlExUjFsekw5cnRvN1FNVQ==';
  private readonly headers = new HttpHeaders({
    'X-CSCAPI-KEY': this.apiKey
  });
  private readonly http = inject(HttpClient);

  private readonly isBrowser = isBrowser();


  async allCountries() {
    if (!this.isBrowser)
      return [];

    const url = `${this.apiUrl}/countries`;

    const countries = await firstValueFrom(this.http.get<Country[]>(url, { headers: this.headers }));


    const details = await Promise.all(countries.map(c => this.countryDetails(c.iso2)));

    return details;
  }

  async allTimezones() {
    return [];
    // const id = 'timezones';

    // const cached = this.cache && await this.cache.get<Timezone[]>(id, THREE_DAY_MS);
    // if (cached)
    //   return cached;

    // const countries = await this.allCountries();
    // const tz = countries.flatMap(c => c.timezones)
    //   .sort((a, b) => sortNumber(a.gmtOffset, b.gmtOffset));

    // if (this.cache)
    //   await this.cache.set(id, tz);
    // return tz;
  }

  async allStates(ciso2: string) {
    return [];
    // try {
    //   const url = `${this.apiUrl}/countries/${ciso2}/states`;
    //   const id = url;
    //   const country = await this.countryDetails(ciso2);

    //   const cached = this.cache && await this.cache.get<State[]>(id, THREE_DAY_MS);
    //   if (cached)
    //     return cached;

    //   const states = await fetch(url, { headers: this.headers })
    //     .then(this.verifyOk)
    //     .then<State[]>(r => r.json())
    //     .catch(this.handleError);

    //   states.forEach(s => {
    //     s.country_code = country.iso2;
    //     s.country_id = country.id;
    //   });

    //   if (this.cache)
    //     await this.cache.set(id, states);
    //   return states;
    // }
    // catch (e) {
    //   console.error(e);
    //   return [];
    // }
  }

  async allCities(ciso2: string, siso2?: string) {
    // try {
    //   const url = siso2 ?
    //     `${this.apiUrl}/countries/${ciso2}/states/${siso2}/cities` :
    //     `${this.apiUrl}/countries/${ciso2}/cities`;
    //   const id = url;

    //   const cached = this.cache && await this.cache.get<City[]>(id, THREE_DAY_MS);
    //   if (cached)
    //     return cached;

    //   const cities = await fetch(url, { headers: this.headers })
    //     .then(this.verifyOk)
    //     .then<City[]>(r => r.json())
    //     .catch(this.handleError);

    //   if (this.cache)
    //     await this.cache.set(id, cities);
    //   return cities;
    // }
    // catch (e) {
    //   console.error(e);
    //   return [];
    // }
  }

  private async countryDetails(ciso2: string) {
    const url = `${this.apiUrl}/countries/${ciso2}`;
    const country = await firstValueFrom(this.http.get<Country>(url, { headers: this.headers }));

    const tzData = (country.timezones as unknown as string).trim();

    country.timezones = tzData ? JSON.parse(tzData) : [];
    country.translations = JSON.parse(country.translations as unknown as string);

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
