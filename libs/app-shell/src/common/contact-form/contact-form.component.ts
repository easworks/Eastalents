import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactUsRequest } from '@easworks/models/contact-us';
import { pattern } from '@easworks/models/pattern';
import { ContactUsApi } from '../../api/contact-us';
import { Country, CSCApi } from '../../api/csc.api';
import { SnackbarComponent } from '../../notification/snackbar';
import { generateLoadingState } from '../../state/loading';
import { sortString } from '../../utilities/sort';
import { DropDownIndicatorComponent } from '../drop-down-indicator.component';
import { controlValue$ } from '../form-field.directive';
import { FormImportsModule } from '../form.imports.module';
import { ImportsModule } from '../imports.module';
import { filterCountryCode, getPhoneCodeOptions, PhoneCodeOption, updatePhoneValidatorEffect } from '../phone-code';
import { ContactFormAcknowledgementComponent } from './acknowledgement.snackbar';

@Component({
  standalone: true,
  selector: 'contact-form',
  templateUrl: './contact-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule,
    DropDownIndicatorComponent,
    MatAutocompleteModule,
    MatSelectModule
  ]
})
export class ContactFormComponent {
  private readonly snackbar = inject(MatSnackBar);
  private readonly api = {
    csc: inject(CSCApi),
    contactUs: inject(ContactUsApi)
  };

  protected readonly trackBy = {
    country: (_: number, c: Country) => c.iso2,
  } as const;

  private readonly allCountries = this.api.csc.allCountries();
  protected readonly loading = generateLoadingState<[
    'countries',
    'submitting'
  ]>();

  protected readonly contact = (() => {
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
        updateOn: 'change'
      }),
      subject: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      message: new FormControl('', {
        nonNullable: true,
        validators: [Validators.maxLength(2048)]
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
      code$: filterCountryCode(allOptions.countryCodes$, values.code$),
      subject: SUBJECT_OPTIONS
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

    const submit = async () => {
      if (!form.valid)
        return;

      this.loading.add('submitting');

      const v = form.getRawValue();

      const input: ContactUsRequest = {
        name: v.name,
        email: v.email,
        phone: v.phoneNumber && v.phoneNumber.code && v.phoneNumber.number ?
          v.phoneNumber.code + v.phoneNumber.number :
          null,
        subject: v.subject,
        message: v.message || null
      };

      try {
        await this.api.contactUs.create(input);
        ContactFormAcknowledgementComponent.open(this.snackbar);
      }
      catch (e) {
        SnackbarComponent.forError(this.snackbar, e);
      }
      finally {
        this.loading.delete('submitting');

      }
    };

    return {
      form,
      options: filteredOptions,
      submit,
      submitting$: this.loading.has('submitting')
    } as const;
  })();

}

const SUBJECT_OPTIONS = [
  'General Questions',
  'Sales Inquiries',
  'Help/Support',
  'Find Work Related',
  'Talent Onboarding',
  'Client Onboarding',
  'Project Proposals',
  'Partnerships',
  'Billing and Payments',
  'Press',
  'Other',
] as const;
