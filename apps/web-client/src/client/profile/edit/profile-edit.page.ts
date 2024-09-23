import { ChangeDetectionStrategy, Component, computed, HostBinding, inject, input, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ClearTriggerOnSelectDirective } from '@easworks/app-shell/common/clear-trigger-on-select.directive';
import { CSCFormComponent } from '@easworks/app-shell/common/csc-form/csc-form.component';
import { DropDownIndicatorComponent } from '@easworks/app-shell/common/drop-down-indicator.component';
import { controlValue$ } from '@easworks/app-shell/common/form-field.directive';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { domainData } from '@easworks/app-shell/state/domain-data';
import { sortNumber, sortString } from '@easworks/app-shell/utilities/sort';
import { ANNUAL_REVENUE_RANGE_OPTIONS, AnnualRevenueRange, CLIENT_SIZE_OPTIONS, CLIENT_TYPE_OPTIONS, ClientProfile, ClientSize, ClientType } from '@easworks/models/client-profile';
import { Domain } from '@easworks/models/domain';
import { EASWORKS_SERVICE_TYPE_OPTIONS, EasworksServiceType, REQUIRED_EXPERIENCE_OPTIONS, RequiredExperience, WORK_ENVIRONMENT_OPTIONS, WorkEnvironment } from '@easworks/models/job-post';
import { SoftwareProduct } from '@easworks/models/software';
import { faCircleInfo, faSquareXmark } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import Fuse from 'fuse.js';
import { ClientProfileEditCardsComponent } from './cards/profile-edit-cards.component';

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
    CSCFormComponent
  ]
})
export class ClientProfileEditPageComponent implements OnInit {
  private readonly store = inject(Store);

  @HostBinding()
  private readonly class = 'block @container';

  protected readonly icons = {
    faCircleInfo,
    faSquareXmark
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
    size: new FormControl(null as unknown as ClientSize, {
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
    location: CSCFormComponent.createForm()
  });

  protected readonly options = {
    clientType: CLIENT_TYPE_OPTIONS,
    clientSize: CLIENT_SIZE_OPTIONS,
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
    const allowAdd$ = computed(() => count$() < 3);

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
    const allowAdd$ = computed(() => count$() < 3);

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
      size: original.size,
      annualRevenueRange: original.annualRevenueRange,
      domains,
      softwareProducts,
      location: {
        city: original.location.city || '',
        country: original.location.country || '',
        state: original.location.state || '',
        timezone: original.location.timezone || ''
      }
    });
  }

  ngOnInit(): void {
    this.reset();
  }

};
