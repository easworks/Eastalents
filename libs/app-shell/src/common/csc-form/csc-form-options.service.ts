import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { City, Country, CSCApi, State, Timezone } from '@easworks/app-shell/api/csc.api';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import Fuse from 'fuse.js';
import { finalize, tap } from 'rxjs';

@Injectable()
export class CSCFormOptions {

  constructor() {
    this.load.country();
  }

  private readonly dRef = inject(DestroyRef);
  private readonly api = {
    csc: inject(CSCApi)
  } as const;

  public readonly loading = generateLoadingState<[
    'countries',
    'states',
    'cities',
    'submitting'
  ]>();

  public readonly allOptions = {
    country$: signal<Country[]>([]),
    state$: signal<State[]>([]),
    city$: signal<City[]>([]),
    timezone$: signal<Timezone[]>([]),
    countryCode: signal<(Country & { plainPhoneCode: string; })[]>([]),
  } as const;

  private readonly search = {
    country$: computed(() => new Fuse(this.allOptions.country$(), {
      keys: ['name', 'iso2', 'iso3'],
      includeScore: true
    })),
    state$: computed(() => new Fuse(this.allOptions.state$(), {
      keys: ['name'],
      includeScore: true
    }))
  } as const;

  public readonly filter = {
    country: (query$: Signal<Country | string | null>) => {

      const results$ = computed(() => {
        let q = query$();

        if (q && typeof q !== 'string')
          q = q.name;

        if (typeof q === 'string') {
          q = q.trim();
          if (q)
            return this.search.country$()
              .search(q)
              .map(r => r.item);
        }

        return this.allOptions.country$();
      });

      return results$;
    },
    state: (query$: Signal<State | string | null>) => {

      const results$ = computed(() => {
        let q = query$();

        if (q && typeof q !== 'string')
          q = q.name;

        if (typeof q === 'string') {
          q = q.trim();
          if (q)
            return this.search.state$()
              .search(q)
              .map(r => r.item);
        }

        return this.allOptions.state$();
      });

      return results$;
    },
  };

  public readonly load = {
    country: () => {
      this.loading.add('countries');
      this.api.csc.allCountries()
        .pipe(
          finalize(() => this.loading.delete('countries')),
          takeUntilDestroyed(this.dRef),
        )
        .subscribe(countries => {
          this.allOptions.country$.set(countries);
        });
    },
    state: (country_iso2: string) => {
      this.loading.add('states');
      this.api.csc.allStates(country_iso2)
        .pipe(
          finalize(() => this.loading.delete('states')),
          takeUntilDestroyed(this.dRef),
        )
        .subscribe(states => {
          if (states.length === 0)
            this.load.cities(country_iso2);
          this.allOptions.state$.set(states);
        });
    },
    cities: (country_iso2: string, state_iso2?: string) => {
      this.loading.add('cities');
      this.api.csc.allCities(country_iso2, state_iso2)
        .pipe(
          finalize(() => this.loading.delete('cities')),
          takeUntilDestroyed(this.dRef),
        )
        .subscribe(cities => {
          this.allOptions.city$.set(cities);
        });
    }
  } as const;
}