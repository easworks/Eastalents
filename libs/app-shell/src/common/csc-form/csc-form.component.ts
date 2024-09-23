import { ChangeDetectionStrategy, Component, DestroyRef, effect, HostBinding, inject, INJECTOR, input, OnInit, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Country } from '@easworks/app-shell/api/csc.api';
import { toPromise } from '@easworks/app-shell/utilities/to-promise';
import { Subscription } from 'rxjs';
import { controlValue$ } from '../form-field.directive';
import { FormImportsModule } from '../form.imports.module';
import { ImportsModule } from '../imports.module';
import { isTimezone } from '../location';
import { CSCFormOptions } from './csc-form-options.service';


@Component({
  standalone: true,
  selector: 'csc-form',
  templateUrl: './csc-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule,
    MatAutocompleteModule
  ],
  providers: [CSCFormOptions]
})
export class CSCFormComponent implements OnInit {
  private readonly optionsService = inject(CSCFormOptions);
  private readonly dRef = inject(DestroyRef);
  private readonly injector = inject(INJECTOR);

  @HostBinding()
  private readonly class = 'block @container';

  public readonly form$ = input.required<CSCFormGroup>({ alias: 'control' });

  protected readonly country = (() => {
    type InputType = Country | string | null;
    const query$ = signal<InputType>('');
    const displayWith = (v: InputType) => v ? (typeof v === 'string' ? v : v.name) : '';

    let sub: Subscription | null = null;

    effect(() => {
      const control = this.form$().controls.country;
      sub?.unsubscribe();

      sub = controlValue$(control)
        .pipe(takeUntilDestroyed(this.dRef))
        .subscribe(v => query$.set(v));
    }, { injector: this.injector, allowSignalWrites: true });

    const results$ = this.optionsService.filter.country(query$);
    const loading$ = this.optionsService.loading.has('countries');

    effect(() => {
      const value = query$();
      if (!value)
        return;

      const options = results$().slice(0, 10);

      if (typeof value === 'string') {
        const match = options.find(o => o.name.toLowerCase() === value.toLowerCase());
        if (match) {
          untracked(this.form$).controls.country.setValue(match);
        }
      }
    });

    return {
      results$,
      loading$,
      displayWith
    } as const;

  })();

  public static createForm() {
    return new FormGroup({
      country: new FormControl('' as unknown as Country | string, {
        validators: [Validators.required],
        nonNullable: true
      }),
      state: new FormControl('', { nonNullable: true }),
      city: new FormControl('', { nonNullable: true }),
      timezone: new FormControl('', {
        validators: [
          Validators.required,
          isTimezone
        ],
        nonNullable: true
      })
    });
  }

  private async fillValue(value = this.form$().value) {
    const form = this.form$();

    if (typeof value.country !== 'string')
      return;

    const country = await toPromise(this.optionsService.loading.has('countries'), v => !v, this.injector)
      .then(() => this.optionsService.allOptions.country$())
      .then(list => list.find(c => c.name === value.country));

    if (!country)
      return;

    form.controls.country.setValue(country);
  }

  ngOnInit(): void {
    this.fillValue();
  }
}

type CSCFormGroup = ReturnType<typeof CSCFormComponent['createForm']>;

