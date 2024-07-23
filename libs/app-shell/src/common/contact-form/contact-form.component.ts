import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactUsRequest } from 'models/contact-us';
import { pattern } from 'models/pattern';
import { finalize, firstValueFrom } from 'rxjs';
import { ContactUsApi } from '../../api/contact-us';
import { Country, CSCApi } from '../../api/csc.api';
import { SnackbarComponent } from '../../notification/snackbar';
import { generateLoadingState } from '../../state/loading';
import { sortString } from '../../utilities/sort';
import { DropDownIndicatorComponent } from '../drop-down-indicator.component';
import { FormImportsModule } from '../form.imports.module';
import { ImportsModule } from '../imports.module';
import { getPhoneCodeOptions, PhoneCodeOption, updatePhoneValidatorEffect } from '../phone-code';
import { ContactFormAcknowledgementComponent } from './acknowledgement.snackbar';
import { PhoneNumberInputComponent } from './phone-number-input/phone-number-input.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    MatSelectModule,
    PhoneNumberInputComponent
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

  private readonly allCountries = firstValueFrom(this.api.csc.allCountries().pipe(takeUntilDestroyed()));
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
        code: new FormControl('', { nonNullable: true }),
        number: new FormControl('', { nonNullable: true }),
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

    updatePhoneValidatorEffect(form.controls.phoneNumber);

    const allOptions = {
      countryCodes$: signal<PhoneCodeOption[]>([]),
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

      this.api.contactUs.create(input)
        .pipe(
          finalize(() => {
            this.loading.delete('submitting');
          }),
          takeUntilDestroyed()
        ).subscribe({
          next: () => {
            ContactFormAcknowledgementComponent.open(this.snackbar);
          },
          error: (e) => {
            SnackbarComponent.forError(this.snackbar, e);
          }
        });
    };

    return {
      form,
      options: allOptions,
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
