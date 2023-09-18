import { ChangeDetectionStrategy, Component, INJECTOR, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CSCApi, Country } from '@easworks/app-shell/api/csc.api';
import { DropDownIndicatorComponent } from '@easworks/app-shell/common/drop-down-indicator.component';
import { controlValue$ } from '@easworks/app-shell/common/form-field.directive';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { PhoneCodeOption, filterCountryCode, getPhoneCodeOptions, updatePhoneValidatorEffect } from '@easworks/app-shell/common/phone-code';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { sortString } from '@easworks/app-shell/utilities/sort';
import { pattern } from '@easworks/models';

@Component({
  standalone: true,
  selector: 'contact-us-page',
  templateUrl: './contact-us.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [],
  imports: [
    LottiePlayerDirective,
    ImportsModule,
    FormImportsModule,
    MatAutocompleteModule,
    DropDownIndicatorComponent
  ]
})
export class ContactUsPageComponent {

  private readonly injector = inject(INJECTOR);
  private readonly api = {
    csc: inject(CSCApi)
  };

  protected readonly trackBy = {
    country: (_: number, c: Country) => c.iso2,
  } as const;

  private readonly allCountries = this.api.csc.allCountries();
  protected readonly loading = generateLoadingState<[
    'countries'
  ]>();

  protected readonly contact = this.initForm();

  private initForm() {
    const form = new FormGroup({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.pattern(pattern.email)],
        nonNullable: true
      }),
      phoneNumber: new FormGroup({
        code: new FormControl(''),
        number: new FormControl('')
      }, {
        updateOn: 'blur'
      }),
      subject: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      message: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
    }, {
      updateOn: 'submit'
    });

    const values = {
      code$: toSignal(controlValue$(form.controls.phoneNumber.controls.code), { requireSync: true })
    } as const;

    updatePhoneValidatorEffect(form.controls.phoneNumber);

    const allOptions = {
      countryCodes$: signal<PhoneCodeOption[]>([])
    } as const;

    const filteredOptions = {
      code$: filterCountryCode(allOptions.countryCodes$, values.code$)
    } as const;

    {
      this.loading.add('countries');
      this.allCountries
        .then(countries => {
          const options = getPhoneCodeOptions(countries).sort((a, b) => sortString(a.name, b.name));

          allOptions.countryCodes$.set(options);

        })
        .finally(() => this.loading.delete('countries'));
    }

    return {
      form,
      options: filteredOptions
    } as const;
  }
}
