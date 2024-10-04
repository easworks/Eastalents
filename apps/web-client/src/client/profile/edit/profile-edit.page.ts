import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, HostBinding, inject, input, OnInit, signal, untracked } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, StatusChangeEvent, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BillingApi } from '@easworks/app-shell/api/billing';
import { AddressFormComponent } from '@easworks/app-shell/common/address-form/address-form.component';
import { ClearTriggerOnSelectDirective } from '@easworks/app-shell/common/clear-trigger-on-select.directive';
import { CSCFormComponent } from '@easworks/app-shell/common/csc-form/csc-form.component';
import { DropDownIndicatorComponent } from '@easworks/app-shell/common/drop-down-indicator.component';
import { controlValue$ } from '@easworks/app-shell/common/form-field.directive';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { domainData } from '@easworks/app-shell/state/domain-data';
import { sortNumber, sortString } from '@easworks/app-shell/utilities/sort';
import { ACCEPTED_CURRENCY_OPTIONS, AcceptedCurrency, BankAccountDescriptor, BusinessRegistrationDescriptor, BusinessTaxationDescriptor, CountryBillingDescriptor, PAYMENT_METHOD_OPTIONS, PAYMENT_TERM_OPTIONS, PaymentMethod, PaymentTerm } from '@easworks/models/billing';
import { ANNUAL_REVENUE_RANGE_OPTIONS, AnnualRevenueRange, BUSINESS_ENTITY_TYPE_OPTIONS, BusinessEntityType, CLIENT_PROFILE_MAX_DOMAINS, CLIENT_PROFILE_MAX_SOFTWARE, CLIENT_TYPE_OPTIONS, ClientProfile, ClientType, EMPLOYEE_COUNT_OPTIONS, EmployeeCount } from '@easworks/models/client-profile';
import { PhoneNumber } from '@easworks/models/contact-us';
import { Domain } from '@easworks/models/domain';
import { EASWORKS_SERVICE_TYPE_OPTIONS, EasworksServiceType, REQUIRED_EXPERIENCE_OPTIONS, RequiredExperience, WORK_ENVIRONMENT_OPTIONS, WorkEnvironment } from '@easworks/models/job-post';
import { SoftwareProduct } from '@easworks/models/software';
import { faCircleInfo, faSquareXmark } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import Fuse from 'fuse.js';
import { filter, map, startWith } from 'rxjs';
import { ClientProfileEditCardsComponent } from './cards/profile-edit-cards.component';
import { ClientProfileContactFormComponent } from './contact-info-form/contact-info-form.component';

type ClientIndustry = ClientProfile['industry'];

@Component({
  selector: 'client-profile-edit-page',
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
    DropDownIndicatorComponent,
    ClientProfileEditCardsComponent,
    MatSelectModule,
    ClearTriggerOnSelectDirective,
    CSCFormComponent,
    ClientProfileContactFormComponent,
    AddressFormComponent,
    MatCheckboxModule,
    MatSlideToggleModule
  ]
})
export class ClientProfileEditPageComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly dref = inject(DestroyRef);
  private readonly api = {
    billing: inject(BillingApi)
  };

  @HostBinding()
  private readonly class = 'block @container';

  protected readonly icons = {
    faCircleInfo,
    faSquareXmark
  } as const;

  protected readonly maxLength = {
    domains: CLIENT_PROFILE_MAX_DOMAINS,
    software: CLIENT_PROFILE_MAX_SOFTWARE
  } as const;

  readonly profile$ = input.required<ClientProfile>({ alias: 'profile' });

  protected readonly isNew$ = signal(true);

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(128)
      ]
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(1500)
      ]
    }),
    type: new FormControl(null as unknown as ClientType, {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),
    businessEntityType: new FormControl(null as unknown as BusinessEntityType, {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),
    employeeCount: new FormControl(null as unknown as EmployeeCount, {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),
    annualRevenueRange: new FormControl(null as unknown as AnnualRevenueRange, {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),
    hiringPreferences: new FormGroup({
      serviceType: new FormControl([] as EasworksServiceType[], {
        nonNullable: true,
        validators: [Validators.required]
      }),
      experience: new FormControl([] as RequiredExperience[], {
        nonNullable: true,
        validators: [Validators.required]
      }),
      workEnvironment: new FormControl([] as WorkEnvironment[], {
        nonNullable: true,
        validators: [Validators.required]
      }),
    }),
    domains: new FormControl([] as Domain[], {
      nonNullable: true,
      validators: [Validators.required]
    }),
    softwareProducts: new FormControl([] as SoftwareProduct[], {
      nonNullable: true,
      validators: [Validators.required]
    }),
    industry: new FormControl(null as unknown as ClientIndustry, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    location: CSCFormComponent.createForm(),
    contact: new FormGroup({
      primary: ClientProfileContactFormComponent.createForm(),
      secondary: ClientProfileContactFormComponent.createForm(),

    }),
    registration: new FormGroup({
      address: AddressFormComponent.createForm(),
      companyId: new FormGroup({
        descriptor: new FormControl(null as BusinessRegistrationDescriptor | null),
        value: new FormControl('', {
          validators: [Validators.required]
        })
      }),
      tax: new FormGroup({
        descriptor: new FormControl(null as BusinessTaxationDescriptor | null),
        value: new FormGroup({
          taxId: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
          }),
          gstId: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
          })
        })
      })
    }),
    bankAccount: new FormGroup({
      desciptor: new FormControl(null as BankAccountDescriptor | null),
      value: new FormGroup({
        account: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required]
        }),
        code: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required]
        })
      })
    }),
    billing: new FormGroup({
      address: AddressFormComponent.createForm(),
      preferences: new FormGroup({
        paymentMethod: new FormControl(null as unknown as PaymentMethod),
        paymentTerm: new FormControl(null as unknown as PaymentTerm),
        paymentCurrency: new FormControl(null as unknown as AcceptedCurrency)
      })
    })
  });

  protected readonly options = {
    clientType: CLIENT_TYPE_OPTIONS,
    businessType: BUSINESS_ENTITY_TYPE_OPTIONS,
    employeeCount: EMPLOYEE_COUNT_OPTIONS,
    annualRevenue: ANNUAL_REVENUE_RANGE_OPTIONS,
    serviceType: EASWORKS_SERVICE_TYPE_OPTIONS,
    experience: REQUIRED_EXPERIENCE_OPTIONS,
    workEnvironment: WORK_ENVIRONMENT_OPTIONS
  } as const;

  protected readonly domains = (() => {
    const list$ = this.store.selectSignal(domainData.selectors.domains.selectAll);
    const map$ = this.store.selectSignal(domainData.selectors.domains.selectEntities);

    const value$ = toSignal(controlValue$(this.form.controls.domains), { requireSync: true });
    const added$ = computed(() => new Set(value$().map(d => d.id)));

    const count$ = computed(() => added$().size);
    const allowAdd$ = computed(() => count$() < this.maxLength.domains);

    const searchable$ = computed(() => {
      const added = added$();
      const list = list$();

      return list.filter(item => !added.has(item.id));
    });

    const search$ = computed(() => new Fuse(searchable$(), {
      keys: ['longName', 'shortName'],
      includeScore: true
    }));

    const query$ = signal<string>('');
    const displayWith = (v: Domain | string | null) => typeof v === 'string' ? v : v?.longName || '';

    const results$ = computed(() => {
      let q = query$();

      if (typeof q === 'string') {
        q = q.trim();
        if (q)
          return search$()
            .search(q)
            .map(r => r.item);
      }

      return searchable$();
    });

    const onSelect = (event: MatAutocompleteSelectedEvent) => {
      const value = event.option.value as Domain;
      const control = this.form.controls.domains;

      let newVal = [...control.value];
      newVal.push(value);
      newVal = newVal.sort((a, b) => sortString(a.id, b.id));

      control.setValue(newVal);
      query$.set('');
    };

    const remove = (idx: number) => {
      const control = this.form.controls.domains;
      const newValue = [...control.value];
      newValue.splice(idx, 1);
      control.setValue(newValue);
    };

    return {
      map$,
      value$,
      count$,
      query$,
      displayWith,
      results$,
      onSelect,
      remove,
      allowAdd$
    } as const;
  })();

  protected readonly software = (() => {
    const list$ = this.store.selectSignal(domainData.selectors.softwareProduct.selectAll);
    const map$ = this.store.selectSignal(domainData.selectors.softwareProduct.selectEntities);

    const value$ = toSignal(controlValue$(this.form.controls.softwareProducts), { requireSync: true });
    const added$ = computed(() => new Set(value$().map(d => d.id)));

    const count$ = computed(() => added$().size);
    const allowAdd$ = computed(() => count$() < this.maxLength.software);

    const searchable$ = computed(() => {
      const added = added$();
      const list = list$();

      return list.filter(item => !added.has(item.id));
    });

    const preferred$ = computed(() => {
      const preferred = new Set<string>();
      this.domains.value$().forEach(domain =>
        domain.products.forEach(product =>
          preferred.add(product)));

      return preferred;
    });

    const search$ = computed(() => {
      const list = searchable$();
      return new Fuse(searchable$(), {
        keys: ['name'],
        includeScore: true,
        sortFn: (a, b) => {
          const preferred = preferred$();

          const has_a = preferred.has(list[a.idx].id);
          const has_b = preferred.has(list[b.idx].id);

          if (has_a && !has_b)
            return -1;
          if (!has_a && has_b)
            return 1;
          return sortNumber(a.score, b.score);
        }
      });
    });

    const query$ = signal<string>('');
    const displayWith = (v: SoftwareProduct | string | null) => typeof v === 'string' ? v : v?.name || '';

    const results$ = computed(() => {
      let q = query$();

      if (typeof q === 'string') {
        q = q.trim();
        if (q)
          return search$()
            .search(q)
            .map(r => r.item);
      }

      return searchable$();
    });

    const onSelect = (event: MatAutocompleteSelectedEvent) => {
      const value = event.option.value as SoftwareProduct;
      const control = this.form.controls.softwareProducts;

      let newVal = [...control.value];
      newVal.push(value);
      newVal = newVal.sort((a, b) => sortString(a.id, b.id));

      control.setValue(newVal);
      query$.set('');
    };

    const remove = (idx: number) => {
      const control = this.form.controls.softwareProducts;
      const newValue = [...control.value];
      newValue.splice(idx, 1);
      control.setValue(newValue);
    };

    return {
      map$,
      value$,
      count$,
      query$,
      displayWith,
      results$,
      onSelect,
      remove,
      allowAdd$
    } as const;
  })();

  protected readonly industry = (() => {
    const data$ = this.store.selectSignal(domainData.feature.selectIndustries);

    const list$ = computed(() => {
      const data = data$();
      const list = [] as ClientIndustry[];
      data.forEach(group =>
        group.industries.forEach(item =>
          list.push({ name: item, group: group.name })
        ));
      return list;
    });

    const value$ = toSignal(controlValue$(this.form.controls.industry), { requireSync: true });

    const search$ = computed(() => new Fuse(list$(), {
      keys: [
        { name: 'name', weight: 4 },
        { name: 'group', weight: 1 }
      ],
      includeScore: true
    }));

    const query$ = signal<string>('');
    const displayWith = (v: ClientIndustry | string | null) => v ? (typeof v === 'string' ? v : `${v.name} - ${v.group}`) : '';

    const results$ = computed(() => {
      let q = query$();

      if (typeof q === 'string') {
        q = q.trim();
        if (q)
          return search$()
            .search(q)
            .map(r => r.item);
      }

      return list$();
    });

    const onSelect = (event: MatAutocompleteSelectedEvent) => {
      this.form.controls.industry.setValue(event.option.value);
      query$.set('');
    };

    const remove = () => {
      this.form.controls.industry.setValue(null as unknown as ClientIndustry);
    };

    return {
      value$,
      query$,
      displayWith,
      results$,
      onSelect,
      remove,
    } as const;
  })();

  protected readonly billingAddress = (() => {
    const sameAsCorporate$ = signal(false);

    effect(() => {
      const enabled = !sameAsCorporate$();
      const control = this.form.controls.billing.controls.address;
      if (enabled) {
        control.enable();
      }
      else {
        control.disable();
      }
    });

    return {
      sameAsCorporate$,
    } as const;
  })();

  protected readonly paymentPreferences = (() => {
    const options = {
      method: PAYMENT_METHOD_OPTIONS,
      term: PAYMENT_TERM_OPTIONS,
      currency: ACCEPTED_CURRENCY_OPTIONS
    };
    return {
      options
    } as const;
  })();

  protected readonly contact = (() => {
    const enableSecondary$ = signal(false);

    effect(() => {
      const enabled = enableSecondary$();
      if (enabled) {
        this.form.controls.contact.controls.secondary.enable();
      }
      else {
        this.form.controls.contact.controls.secondary.disable();
      }
    });

    return { enableSecondary$ } as const;
  })();

  protected readonly registration = (() => {

    const descriptors = (() => {
      const list$ = signal<CountryBillingDescriptor[]>([]);

      const control = this.form.controls.registration.controls.address.controls.country;
      const country$ = toSignal(control.events.pipe(
        filter((ev) => ev instanceof StatusChangeEvent && ev.status === 'VALID'),
        startWith(control.value),
        map(() => typeof control.value !== 'string' && control.value),
      ));

      const countryDesc$ = computed(() => {
        const country = country$();
        if (!country)
          return null;

        const list = list$();
        const descriptor = list.find(d => d.iso2 === country?.iso2);

        return descriptor || null;
      });

      const tax = (() => {
        const options$ = computed(() => countryDesc$()?.business.tax || []);

        const showControl$ = computed(() => options$().length > 1);

        const taxDesc$ = toSignal(controlValue$(this.form.controls.registration.controls.tax.controls.descriptor), { initialValue: null });

        return {
          options$,
          taxDesc$,
          showControl$
        } as const;
      })();

      const companyId = (() => {
        const options$ = computed(() => countryDesc$()?.business.id || []);

        const showControl$ = computed(() => options$().length > 1);

        const idDesc$ = toSignal(controlValue$(this.form.controls.registration.controls.companyId.controls.descriptor), { initialValue: null });

        return {
          options$,
          idDesc$,
          showControl$
        } as const;
      })();

      const bankDesc$ = toSignal(controlValue$(this.form.controls.bankAccount.controls.desciptor), { initialValue: null });

      effect(() => {
        const options = companyId.options$();
        const control = this.form.controls.registration
          .controls.companyId
          .controls.descriptor;

        if (options.length === 0) {
          control.setValue(null);
        }
        else if (options.length === 1) {
          control.setValue(options[0]);
        }
        else {
          const profile = untracked(this.profile$);
          const existing = profile.registration.id.descriptor;

          if (existing) {
            const match = options.find(o => o === existing);
            if (match)
              control.setValue(match);
          }
          else {
            control.setValue(options[0]);
          }
        }
      });

      effect(() => {
        const options = tax.options$();
        const control = this.form.controls.registration
          .controls.tax
          .controls.descriptor;

        if (options.length === 0) {
          control.setValue(null);
        }
        else if (options.length === 1) {
          control.setValue(options[0]);
        }
        else {
          const profile = untracked(this.profile$);
          const existing = profile.registration.tax.descriptor;

          if (existing) {
            const match = options.find(o =>
              o.taxId === (existing?.taxId || null) &&
              o.gstId === (existing?.gstId || null)
            );
            if (match)
              control.setValue(match);
          }
          else {
            control.setValue(options[0]);
          }
        }
      });

      effect(() => {
        const control = this.form.controls.bankAccount
          .controls.desciptor;

        const countryDesc = countryDesc$();
        if (countryDesc) {
          control.setValue(countryDesc.bank);
        }
        else {
          control.setValue(null);
        }
      });

      return {
        list$,
        tax,
        bankDesc$,
        companyId
      } as const;
    })();

    const labels = {
      companyId$: signal(''),
      taxId$: signal(''),
      gstId$: signal(''),
      bank: {
        account$: signal(''),
        code$: signal(''),
      }
    };

    effect(() => {
      const descriptor = descriptors.companyId.idDesc$();

      let label = 'Company Registration Number';

      if (descriptor) {
        label = descriptor;
      }

      labels.companyId$.set(label);
    }, { allowSignalWrites: true });

    effect(() => {
      const descriptor = descriptors.tax.taxDesc$();

      let label = {
        taxId: 'Tax Information Number',
        gstId: 'GST Number'
      };

      if (descriptor?.taxId) {
        label.taxId = descriptor.taxId;
      }

      if (descriptor?.gstId) {
        label.gstId = descriptor.gstId;
        this.form.controls.registration
          .controls.tax
          .controls.value
          .controls.gstId
          .enable();
      }
      else {
        this.form.controls.registration
          .controls.tax
          .controls.value
          .controls.gstId
          .disable();
      }

      labels.taxId$.set(label.taxId);
      labels.gstId$.set(label.gstId);

    }, { allowSignalWrites: true });

    effect(() => {
      const descriptor = descriptors.bankDesc$();

      let label = {
        account: 'Bank Account',
        code: 'Bank Code'
      };

      if (descriptor?.account)
        label.account = descriptor.account;

      if (descriptor?.code)
        label.code = descriptor.code;

      labels.bank.account$.set(label.account);
      labels.bank.code$.set(label.code);
    }, { allowSignalWrites: true });

    return {
      labels,
      descriptors,
    } as const;
  })();

  protected reset() {
    const original = this.profile$();

    let domains;
    {
      const map = this.domains.map$();
      domains = original.domains.map(id => map[id]!);
    };

    let softwareProducts;
    {
      const map = this.software.map$();
      softwareProducts = original.softwareProducts.map(id => map[id]!);
    };

    this.form.reset({
      name: original.name || '',
      description: original.description || '',
      type: original.type,
      businessEntityType: original.businessEntityType,
      employeeCount: original.employeeCount,
      annualRevenueRange: original.annualRevenueRange,
      industry: original.industry,

      registration: {
        address: original.registration.address ? {
          line1: original.registration.address.line1,
          line2: original.registration.address.line2 || '',
          city: original.registration.address.city || '',
          state: original.registration.address.state || '',
          country: original.registration.address.country,
          postalCode: original.registration.address.postalCode
        } : undefined,
        companyId: original.registration.id,
        tax: {
          descriptor: original.registration.tax.descriptor,
          value: {
            taxId: original.registration.tax.value.taxId || '',
            gstId: original.registration.tax.value.gstId || ''
          }
        }
      },

      billing: {
        address: original.billing.address ? {
          line1: original.billing.address.line1,
          line2: original.billing.address.line2 || '',
          city: original.billing.address.city || '',
          state: original.billing.address.state || '',
          country: original.billing.address.country,
          postalCode: original.billing.address.postalCode
        } : undefined,
        preferences: original.billing.preferences
      },

      domains,
      softwareProducts,

      hiringPreferences: original.hiringPreferences,

      location: {
        city: original.location.city || '',
        country: original.location.country || '',
        state: original.location.state || '',
        timezone: original.location.timezone || ''
      },

      contact: {
        primary: {
          email: original.contact.primary.email || '',
          name: original.contact.primary.name,
          phoneNumber: original.contact.primary.phone ?
            PhoneNumber.split(original.contact.primary.phone)
            : undefined,
          website: original.contact.primary.website || ''
        },
        secondary: original.contact.secondary ? {
          email: original.contact.secondary.email || '',
          name: original.contact.secondary.name,
          phoneNumber: original.contact.secondary.phone ?
            PhoneNumber.split(original.contact.secondary.phone)
            : undefined,
          website: original.contact.primary.website || ''
        } : undefined
      }

    });

    this.billingAddress.sameAsCorporate$.set(!original.billing.address);
    this.contact.enableSecondary$.set(!!original.contact.secondary);
  }

  ngOnInit(): void {
    this.reset();

    this.api.billing.taxIds()
      .pipe(takeUntilDestroyed(this.dref))
      .subscribe(data => this.registration.descriptors.list$.set(data));
  }

};
