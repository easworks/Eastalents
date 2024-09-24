import { ChangeDetectionStrategy, Component, DestroyRef, effect, HostBinding, inject, INJECTOR, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroupDirective } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Subscription } from 'rxjs';
import { DropDownIndicatorComponent } from '../drop-down-indicator.component';
import { controlValue$ } from '../form-field.directive';
import { FormImportsModule } from '../form.imports.module';
import { ImportsModule } from '../imports.module';
import { filterCountryCode, PhoneCodeForm, PhoneCodeOption } from '../phone-code';

@Component({
  standalone: true,
  selector: 'phone-number-input',
  templateUrl: './phone-number-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule,
    DropDownIndicatorComponent,
    MatAutocompleteModule,
  ]
})
export class PhoneNumberInputComponent implements OnInit {
  private readonly dRef = inject(DestroyRef);
  private readonly injector = inject(INJECTOR);
  private readonly formGroupDirective = inject(FormGroupDirective, { self: true });

  @HostBinding()
  private readonly class = 'flex gap-2 justify-start';

  protected get form() {
    return this.formGroupDirective.control as PhoneCodeForm;
  }

  public readonly options$ = input.required<PhoneCodeOption[]>({ alias: 'options' });

  protected readonly filteredOptions = (() => {
    const query$ = signal('' as PhoneCodeForm['controls']['code']['value']);

    const $ = filterCountryCode(this.options$, query$);

    return {
      query$,
      $
    } as const;
  })();

  ngOnInit() {

    let sub: Subscription | null = null;

    effect(() => {
      const control = this.form.controls.code;
      sub?.unsubscribe();

      sub = controlValue$(control)
        .pipe(takeUntilDestroyed(this.dRef))
        .subscribe(v => this.filteredOptions.query$.set(v));
    }, { injector: this.injector, allowSignalWrites: true });

  }
}