import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, map, of, zip } from 'rxjs';
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


  allCountries() {
    if (!this.isBrowser)
      return of([]);

    const url = `${this.apiUrl}/countries`;

    return this.http.get<Country[]>(url, { headers: this.headers });
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

  allStates(ciso2: string) {
    if (!this.isBrowser)
      return of([]);

    const url = `${this.apiUrl}/countries/${ciso2}/states`;

    return zip(
      this.countryDetails(ciso2),
      this.http.get<State[]>(url, { headers: this.headers }),
    ).pipe(map(([country, states]) => {
      states.forEach(s => {
        s.country_iso2 = country.iso2;
        s.country_id = country.id;
      });
      return states;
    }));
  }

  allCities(ciso2: string, siso2?: string) {
    if (!this.isBrowser)
      return of([]);

    const url = siso2 ?
      `${this.apiUrl}/countries/${ciso2}/states/${siso2}/cities` :
      `${this.apiUrl}/countries/${ciso2}/cities`;

    return this.http.get<City[]>(url, { headers: this.headers });
  }

  private countryDetails(ciso2: string) {
    const url = `${this.apiUrl}/countries/${ciso2}`;

    return this.http.get<Country>(url, { headers: this.headers })
      .pipe(map(country => {
        const tzData = (country.timezones as unknown as string).trim();
        country.timezones = tzData ? JSON.parse(tzData) : [];
        country.translations = JSON.parse(country.translations as unknown as string);

        return country;
      }));
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

  country_iso2: string;
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
