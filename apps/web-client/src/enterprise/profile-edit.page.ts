import { KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormRecord, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { CSCApi, Country } from '@easworks/app-shell/api/csc';
import { IndustryGroup } from '@easworks/app-shell/api/talent.api';
import { DropDownIndicatorComponent } from '@easworks/app-shell/common/drop-down-indicator.component';
import { controlValue$ } from '@easworks/app-shell/common/form-field.directive';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { filterCountryCode, getPhoneCodeOptions, updatePhoneValidatorEffect } from '@easworks/app-shell/common/phone-code';
import { AuthState } from '@easworks/app-shell/state/auth';
import { DomainState } from '@easworks/app-shell/state/domains';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { SelectableOption } from '@easworks/app-shell/utilities/options';
import { sortString } from '@easworks/app-shell/utilities/sort';
import { BUSINESS_TYPE_OPTIONS, BusinessType, EMPLOYEE_SIZE_OPTIONS, EmployeeSize } from '@easworks/models';

@Component({
  selector: 'enterprise-profile-edit-page',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    LottiePlayerDirective,
    FormImportsModule,
    MatPseudoCheckboxModule,
    MatAutocompleteModule,
    DropDownIndicatorComponent
  ]
})
export class EnterpriseProfileEditPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly domains = inject(DomainState);
  private readonly user = inject(AuthState).user$;
  private readonly api = {
    csc: inject(CSCApi)
  } as const;

  @HostBinding() private readonly class = 'flex flex-col lg:flex-row';
  private readonly loading = generateLoadingState<[
    'industries',
    'domains',
    'country'
  ]>();

  protected readonly trackBy = {
    country: (_: number, c: Country) => c.iso2,
    name: (_: number, i: { name: string }) => i.name,
    stringOption: (_: number, s: SelectableOption<string>) => s.value,
    key: (_: number, kv: KeyValue<string, unknown>) => kv.key
  } as const;

  protected readonly displayWith = {
    checkbox: (value: boolean) => value ? 'checked' : 'unchecked'
  } as const;

  protected readonly isNew = this.route.snapshot.queryParamMap.has('new');
  private readonly allCountries = this.api.csc.allCountries();

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(300)
      ]
    }),
    summary: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(1500)
      ]
    }),
    type: new FormControl(null as unknown as SelectableOption<BusinessType>, {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),
    employeeSize: new FormControl(null as unknown as SelectableOption<EmployeeSize>, {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),
    industry: new FormGroup({
      group: new FormControl(null as unknown as IndustryGroup, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      })
    }),
    software: new FormRecord<FormControl<SelectableOption<string>[]>>({}),
    contact: new FormGroup({
      email: new FormControl(
        this.isNew && this.user()?.email || '', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),
      phoneNumber: new FormGroup({
        code: new FormControl(''),
        number: new FormControl(''),
      })
    })
  });

  protected readonly type = {
    toggle: (option: SelectableOption<BusinessType>) => {
      if (option.selected)
        return;

      const control = this.form.controls.type;
      option.selected = true;
      const old = control.value;
      if (old) {
        old.selected = false;
      }
      control.setValue(option);
    },
    options: BUSINESS_TYPE_OPTIONS.map<SelectableOption<BusinessType>>(t => ({
      selected: false,
      value: t,
      label: t
    }))
  } as const;

  protected readonly employeeSize = {
    toggle: (option: SelectableOption<EmployeeSize>) => {
      if (option.selected)
        return;

      const control = this.form.controls.employeeSize;
      option.selected = true;
      const old = control.value;
      if (old) {
        old.selected = false;
      }
      control.setValue(option);
    },
    options: EMPLOYEE_SIZE_OPTIONS.map<SelectableOption<EmployeeSize>>(s => ({
      selected: false,
      value: s,
      label: s
    }))
  } as const;

  protected readonly industry = this.initIndustry();
  protected readonly software = this.initSoftware();
  protected readonly contact = this.initContact();

  private initIndustry() {
    this.domains.getIndustries()

    const query$ = signal<string>('');

    const filteredOptions$ = computed(() => {
      const q = query$();
      const all = this.domains.industries$();

      const filter = q && q.trim().toLowerCase();

      if (filter) {
        const filtered = all
          .map<IndustryGroup>(g => {
            const matchGroup = g.name.toLowerCase().includes(filter);
            if (matchGroup) {
              return g;
            }
            return {
              name: g.name,
              industries: g.industries.filter(i => i.toLowerCase().includes(filter)),
            }
          })
          .filter(ig => ig.industries.length);
        return filtered;
      }

      return all;
    });

    const select = (group: IndustryGroup, name: string) => {
      this.form.controls.industry.setValue({ group, name });
    }

    const clear = () => {
      this.form.controls.industry.setValue({
        group: null as unknown as IndustryGroup,
        name: ''
      })
    }

    const loadingIndustries = this.domains.loading.has('industries');
    effect(() => {
      if (loadingIndustries())
        this.loading.add('industries')
      else
        this.loading.delete('industries')
    }, { allowSignalWrites: true });
    const loading$ = this.loading.has('industries');

    return {
      query$,
      options$: filteredOptions$,
      select,
      clear,
      loading$
    }
  }

  private initSoftware() {
    const count$ = signal(0);
    const hasItems$ = computed(() => count$() > 0);



    const form = this.form.controls.software;
    const value$ = toSignal(controlValue$(form), { requireSync: true });

    const query$ = signal<string | object>('');

    type OptionGroup = {
      name: string;
      software: SelectableOption<string>[];
    };

    const all$ = computed(() => this.domains.domains$()
      .map<OptionGroup>(d => ({
        name: d.longName,
        software: d.allProducts.map(p => ({
          selected: false,
          value: p.name,
          label: p.name
        }))
      })));

    const filteredOptions$ = computed(() => {
      const q = query$();
      const all = all$();

      const filter = typeof q === 'string' && q && q.trim().toLowerCase();

      const filtered = all
        .map(g => {
          const matchGroup = filter && g.name.toLowerCase().includes(filter)
          if (matchGroup) {
            return {
              name: g.name,
              software: g.software.filter(i => !i.selected),
            };
          }
          return {
            name: g.name,
            software: g.software.filter(i => !i.selected && (!filter || i.value.toLowerCase().includes(filter)))
          }
        })
        .filter(g => g.software.length);

      return filtered;
    })

    const handlers = {
      add: (domain: string, option: SelectableOption<string>) => {
        if (option.selected)
          return;
        option.selected = true;
        let control = form.controls[domain];
        if (!control) {
          control = new FormControl([], { nonNullable: true });
          form.addControl(domain, control);
        }
        control.value.push(option);
        control.value.sort((a, b) => sortString(a.value, b.value));
        control.updateValueAndValidity();
        query$.mutate(v => v);
        count$.update(v => ++v);
      },
      remove: (domain: string, i: number) => {
        const control = form.controls[domain];
        if (!control)
          throw new Error('invalid operation');
        const option = control.value.at(i);
        if (!option)
          throw new Error('invalid operation');

        option.selected = false;
        control.value.splice(i, 1);
        if (control.value.length)
          control.updateValueAndValidity();
        else
          form.removeControl(domain);
        query$.mutate(v => v);
        count$.update(v => --v);
      }
    }

    const loadingDomain = this.domains.loading.has('domains');
    effect(() => {
      if (loadingDomain())
        this.loading.add('domains')
      else
        this.loading.delete('domains')
    }, { allowSignalWrites: true });
    const loading$ = this.loading.has('domains');

    return {
      count$,
      hasItems$,
      loading$,
      value$,
      query$,
      options$: filteredOptions$,
      ...handlers
    }
  }

  private initContact() {
    const form = this.form.controls.contact;
    const values = {
      phone: {
        code: toSignal(controlValue$(form.controls.phoneNumber.controls.code), { requireSync: true }),
      },
    } as const;

    const allOptions = {
      countries: signal<Country[]>([]),
      countryCode: signal<(Country & { plainPhoneCode: string })[]>([]),
    } as const;

    const filteredOptions = {
      phoneCode$: filterCountryCode(allOptions.countryCode, values.phone.code)
    } as const;

    updatePhoneValidatorEffect(form.controls.phoneNumber);

    this.loading.add('country');
    this.allCountries
      .then(async countries => {
        allOptions.countries.set([...countries].sort((a, b) => sortString(a.name, b.name)));
        allOptions.countryCode.set(getPhoneCodeOptions(allOptions.countries()));

        this.loading.delete('country');
      });

    return {
      options: filteredOptions
    }
  }
}
