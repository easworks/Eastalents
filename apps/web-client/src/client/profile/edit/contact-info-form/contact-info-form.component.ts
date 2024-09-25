import { ChangeDetectionStrategy, Component, HostBinding, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CSCApi } from '@easworks/app-shell/api/csc.api';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { getPhoneCodeOptions, PhoneCodeOption } from '@easworks/app-shell/common/phone-code';
import { PhoneNumberInputComponent } from '@easworks/app-shell/common/phone-number-input/phone-number-input.component';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { sortString } from '@easworks/app-shell/utilities/sort';
import { finalize, map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'client-profile-contact-form',
  templateUrl: './contact-info-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule,
    PhoneNumberInputComponent
  ]
})
export class ClientProfileContactFormComponent {
  private readonly api = {
    csc: inject(CSCApi)
  } as const;

  @HostBinding()
  private readonly class = 'block @container';

  private readonly loading = generateLoadingState<[
    'phone codes'
  ]>();

  public readonly form$ = input.required<ClientProfileContactFormGroup>({ alias: 'control' });

  public static createForm() {
    return new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      email: new FormControl('', {
        validators: [Validators.email],
        nonNullable: true
      }),
      phoneNumber: new FormGroup({
        code: new FormControl('', { nonNullable: true }),
        number: new FormControl('', { nonNullable: true }),
      }),
      website: new FormControl('', {
        nonNullable: true
      })
    }, {
      validators: [
        c => {
          const { email, phoneNumber } = c.value;

          if (!email && !phoneNumber.code && !phoneNumber.number)
            return { requireContact: true };

          return null;
        }
      ]
    });
  }

  protected readonly phoneCode = (() => {
    const options$ = signal<PhoneCodeOption[]>([]);

    {
      this.loading.add('phone codes');
      this.api.csc.allCountries()
        .pipe(
          map(countries => {
            const options = getPhoneCodeOptions(countries)
              .sort((a, b) => sortString(a.name, b.name));
            this.phoneCode.options$.set(options);
          }),
          finalize(() => this.loading.delete('phone codes'))
        ).subscribe();
    }

    return {
      options$
    } as const;
  })();
}

type ClientProfileContactFormGroup = ReturnType<typeof ClientProfileContactFormComponent['createForm']>;
