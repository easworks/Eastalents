import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, of, switchMap, zip } from 'rxjs';
import { isBrowser } from '../utilities/platform-type';
import { sortNumber } from '../utilities/sort';
import { SingleRequest } from './single-request';

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
  private readonly singleReq = inject(SingleRequest);

  private readonly isBrowser = isBrowser();


  allCountries() {
    if (!this.isBrowser)
      return of([]);

    const url = `${this.apiUrl}/countries`;

    return this.singleReq.process(
      url,
      this.http.get<Country[]>(url, { headers: this.headers })
        .pipe(switchMap(countries => zip(countries.map(c => this.countryDetails(c.iso2)))))
    );
  }

  allTimezones() {
    return this.allCountries()
      .pipe(map(countries =>
        countries.flatMap(c => c.timezones)
          .sort((a, b) => sortNumber(a.gmtOffset, b.gmtOffset))
      ));
  }

  allStates(ciso2: string) {
    if (!this.isBrowser)
      return of([]);

    const url = `${this.apiUrl}/countries/${ciso2}/states`;

    return this.singleReq.process(
      url,
      zip(
        this.countryDetails(ciso2),
        this.http.get<State[]>(url, { headers: this.headers }),
      ).pipe(map(([country, states]) => {
        states.forEach(s => {
          s.country_iso2 = country.iso2;
          s.country_id = country.id;
        });
        return states;
      }))
    );
  }

  allCities(ciso2: string, siso2?: string) {
    if (!this.isBrowser)
      return of([]);

    const url = siso2 ?
      `${this.apiUrl}/countries/${ciso2}/states/${siso2}/cities` :
      `${this.apiUrl}/countries/${ciso2}/cities`;

    return this.singleReq.process(
      url,
      this.http.get<City[]>(url, { headers: this.headers })
    );
  }

  private countryDetails(ciso2: string) {
    const url = `${this.apiUrl}/countries/${ciso2}`;

    return this.singleReq.process(
      url,
      this.http.get<Country>(url, { headers: this.headers })
        .pipe(map(country => {
          const tzData = (country.timezones as unknown as string).trim();
          country.timezones = tzData ? JSON.parse(tzData) : [];
          country.translations = JSON.parse(country.translations as unknown as string);

          return country;
        }))
    );
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
