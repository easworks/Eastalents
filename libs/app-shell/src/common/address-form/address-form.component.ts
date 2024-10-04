import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, EffectRef, HostBinding, inject, INJECTOR, input, OnInit, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { dynamicallyRequired } from '@easworks/app-shell/utilities/dynamically-required';
import { toPromise } from '@easworks/app-shell/utilities/to-promise';
import { Subscription } from 'rxjs';
import { CSCFormOptions } from '../csc-form/csc-form-options.service';
import { controlValue$ } from '../form-field.directive';
import { FormImportsModule } from '../form.imports.module';
import { ImportsModule } from '../imports.module';
import { Country } from '@easworks/app-shell/api/csc.api';


@Component({
  standalone: true,
  selector: 'address-form',
  templateUrl: './address-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule,
    MatAutocompleteModule,
    MatSelectModule
  ],
  providers: [CSCFormOptions]
})
export class AddressFormComponent implements OnInit {
  private readonly options = inject(CSCFormOptions);
  private readonly dRef = inject(DestroyRef);
  private readonly injector = inject(INJECTOR);

  @HostBinding()
  private readonly class = 'block @container';

  public readonly form$ = input.required<AddressFormGroup>({ alias: 'control' });

  protected readonly country = (() => {
    const query$ = signal('');
    const displayWith = (v: string | Country) => v && typeof v !== 'string' ? v.name : v;

    const results$ = this.options.filter.country(query$);
    const loading$ = this.options.loading.has('countries');

    let sub: Subscription | null = null;

    effect(() => {
      const control = this.form$().controls.country;
      sub?.unsubscribe();

      sub = controlValue$(control)
        .pipe(takeUntilDestroyed(this.dRef))
        .subscribe(v => {
          if (v && typeof v !== 'string') {
            query$.set(v.name);
          }
          else {
            query$.set(v);
          }
        });
    }, { injector: this.injector, allowSignalWrites: true });


    effect(() => {
      const value = query$();
      if (!value)
        return;

      this.options.all.state$.set([]);
      this.options.all.city$.set([]);
      this.options.all.timezone$.set([]);

      const options = results$().slice(0, 20);

      const match = options.find(o => o.name.toLowerCase() === value.toLowerCase());
      if (match) {
        if (match.name !== value) {
          untracked(this.form$).controls.country.setValue(match);
        }
        else {
          this.options.load.state(match.iso2);
          this.options.load.timezone(match);
        }
      }
    }, { allowSignalWrites: true });

    return {
      results$,
      loading$,
      displayWith
    } as const;

  })();

  protected readonly state = (() => {
    const query$ = signal('');

    const results$ = this.options.filter.state(query$);
    const loading$ = this.options.loading.has('states');

    const required$ = computed(() => this.options.all.state$().length > 0);

    let sub: Subscription | null = null;
    let eff: EffectRef | null = null;

    effect(() => {
      const control = this.form$().controls.state;

      sub?.unsubscribe();
      eff?.destroy();

      untracked(() => {
        eff = dynamicallyRequired(required$, control, this.injector);
      });

      sub = controlValue$(control)
        .pipe(takeUntilDestroyed(this.dRef))
        .subscribe(v => query$.set(v));
    }, { injector: this.injector, allowSignalWrites: true });

    effect(() => {
      const value = query$();
      if (!value)
        return;

      this.options.all.city$.set([]);

      const options = results$().slice(0, 20);

      const match = options.find(o => o.name.toLowerCase() === value.toLowerCase());
      if (match) {
        if (match.name !== value) {
          untracked(this.form$).controls.state.setValue(match.name);
        }
        else {
          this.options.load.cities(match.country_iso2, match.iso2);
        }
      }

    }, { allowSignalWrites: true });

    return {
      results$,
      loading$,
      required$
    } as const;
  })();

  protected readonly city = (() => {
    const query$ = signal('');

    const results$ = this.options.filter.city(query$);
    const loading$ = this.options.loading.has('cities');

    const required$ = computed(() => this.options.all.city$().length > 0);

    let sub: Subscription | null = null;
    let eff: EffectRef | null = null;

    effect(() => {
      const control = this.form$().controls.city;
      sub?.unsubscribe();
      eff?.destroy();

      untracked(() => {
        eff = dynamicallyRequired(required$, control, this.injector);
      });

      sub = controlValue$(control)
        .pipe(takeUntilDestroyed(this.dRef))
        .subscribe(v => query$.set(v));
    }, { injector: this.injector, allowSignalWrites: true });

    effect(() => {
      const value = query$();
      if (!value)
        return;

      const options = results$().slice(0, 20);

      const match = options.find(o => o.name.toLowerCase() === value.toLowerCase());
      if (match) {
        if (match.name !== value) {
          untracked(this.form$).controls.city.setValue(match.name);
        }
      }
    });

    return {
      results$,
      loading$,
      required$
    } as const;
  })();

  public static createForm() {
    return new FormGroup({
      country: new FormControl('' as string | Country, {
        validators: [Validators.required],
        nonNullable: true
      }),
      state: new FormControl('', { nonNullable: true }),
      city: new FormControl('', { nonNullable: true }),
      line1: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      line2: new FormControl('', { nonNullable: true, }),
      postalCode: new FormControl('', { nonNullable: true, validators: [Validators.required] })
    });
  }

  private async fillValue(value = this.form$().value) {

    const form = this.form$();

    if (typeof value.country !== 'string')
      return;

    if (value.country) {
      form.controls.country.setValue(value.country);

      // wait for states to be loaded
      {
        const loading = this.options.loading.has('states');
        await toPromise(loading, v => v, this.injector);
        await toPromise(loading, v => !v, this.injector);
      }

      if (value.state) {
        form.controls.state.setValue(value.state);
      }

      // wait for cities to be loaded
      {
        const loading = this.options.loading.has('cities');
        await toPromise(loading, v => v, this.injector);
        await toPromise(loading, v => !v, this.injector);
      }

      if (value.city) {
        form.controls.city.setValue(value.city);
      }
    }
  }

  ngOnInit(): void {
    this.fillValue();
  }
}

type AddressFormGroup = ReturnType<typeof AddressFormComponent['createForm']>;

