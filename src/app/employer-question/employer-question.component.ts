import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { first, map, shareReplay, startWith, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoadingState } from '../_helpers/loading-state';
import { sleep } from '../_helpers/sleep';
import { sortString } from '../_helpers/sort';
import { SubscribedDirective } from '../_helpers/subscribed-directive';
import { DomainDictionary } from '../_models/domain';
import { HttpService } from '../_services/http.service';
import * as industryData from './industry-data';

@Component({
  selector: 'employer-question',
  templateUrl: './employer-question.component.html',
  styleUrls: ['./employer-question.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployerQuestionComponent extends SubscribedDirective implements OnInit {
  constructor(
    private readonly http: HttpService
  ) {
    super();
  }

  private domainDictionary!: DomainDictionary;

  readonly loading$ = new LoadingState(new Set<LoadingStates>());
  readonly isLoading$ = this.loading$.size$.pipe(
    map(v => v > 0),
    shareReplay({ refCount: true, bufferSize: 1 }));

  readonly step$ = new BehaviorSubject<Step>('start');

  readonly stepper = {
    totalSteps: 6,
    showControls$: this.step$.pipe(
      map(s => s !== 'start'),
      shareReplay({ refCount: true, bufferSize: 1 })),
    progress$: this.step$.pipe(
      map(s => {
        switch (s) {
          case 'enterprise application domain': return 1;
          case 'enterprise application software': return 2;
          case 'primary role': return 3;
          case 'need dev': return 4;
          case 'project type': return 5;
          case 'company info': return 6;
          default: return null;
        }
      }),
      shareReplay({ refCount: true, bufferSize: 1 })
    ),
    previous: {
      visible$: this.step$.pipe(
        map(s => s !== 'enterprise application domain'),
        shareReplay({ refCount: true, bufferSize: 1 })),
      click: (step: Step) => {
        switch (step) {
          case 'enterprise application software': this.step$.next('enterprise application domain'); break;
          case 'primary role': this.step$.next('enterprise application software'); break;
          case 'need dev': this.step$.next('primary role'); break;
          case 'company info': this.step$.next('primary role'); break;
        }
        document.scrollingElement?.scroll({ top: 0, behavior: 'smooth' });
      }
    },
    skip: {
      visible$: this.step$.pipe(
        map(s => false),
        shareReplay({ refCount: true, bufferSize: 1 }))
    },
    next: {
      disabled$: new BehaviorSubject(false),
      click: async (currentStep: Step) => {
        switch (currentStep) {
          case 'start': this.step$.next('enterprise application domain'); break;
          case 'enterprise application domain': this.entAppDomain.next(); break;
          case 'enterprise application software': this.entAppSoftware.next(); break;
          case 'primary role': this.primaryRole.next(); break;
        }
        document.scrollingElement?.scroll({ top: 0, behavior: 'smooth' });
      }
    }
  } as const;

  readonly entAppDomain = {
    filterString$: new BehaviorSubject(''),
    gettingOptions$: this.loading$.has$('getting domain options'),
    options$: new BehaviorSubject<PrimaryDomainOption[]>([]),
    filteredOptions$: new BehaviorSubject<PrimaryDomainOption[]>([]),
    selected$: new BehaviorSubject<PrimaryDomainOption[]>([]),
    init: () => {
      combineLatest([
        this.entAppDomain.filterString$,
        this.entAppDomain.options$
      ]).pipe(
        takeUntil(this.destroyed$),
        map(([filter, options]) => {
          const f = filter.toLowerCase();
          return options.filter(opt =>
            opt.short.toLowerCase().includes(f) ||
            opt.long.toLowerCase().includes(f)
          )
        })
      ).subscribe(this.entAppDomain.filteredOptions$);
    },
    select: (value: PrimaryDomainOption) => {
      if (value.selected)
        return;

      value.selected = true;
      const selected = this.entAppDomain.selected$.value;
      selected.push(value);
      selected.sort((a, b) => sortString(a.long, b.long));
      this.entAppDomain.selected$.next(selected);
      this.entAppDomain.filterString$.next('');
    },
    remove: (index: number) => {
      const selected = this.entAppDomain.selected$.value;
      const v = selected[index]
      selected.splice(index, 1);
      v.selected = false;
      this.entAppDomain.selected$.next(selected);
    },
    next: () => {
      this.step$.next('enterprise application software');
    }
  } as const;

  readonly entAppSoftware = {
    domain: {
      selected$: new BehaviorSubject<SoftwareDomainOption | null>(null),
      options$: new BehaviorSubject<SoftwareDomainOption[]>([]),
      select: (value: SoftwareDomainOption) => {
        const all = this.entAppSoftware.domain.options$.value;
        all.forEach(o => o.selected = false);
        value.selected = true;
        this.entAppSoftware.domain.selected$.next(value);
      }
    },
    application: {
      filterString$: new BehaviorSubject(''),
      filteredOptions$: new BehaviorSubject<SelectableOption[]>([]),
      options$: new BehaviorSubject<SelectableOption[]>([]),
      selected$: new BehaviorSubject<SelectedSoftware[]>([]),
      select: (value: SelectableOption) => {
        const current = this.entAppSoftware.application.selected$.value;
        const selectedDomain = this.entAppSoftware.domain.selected$.value;
        if (!selectedDomain)
          throw new Error('invalid operation');

        if (!value.selected) {
          value.selected = true;
          current.push({
            domain: selectedDomain,
            application: value,
            label: `${selectedDomain.value} - ${value.value}`
          });
          current.sort((a, b) => sortString(a.label, b.label));
          this.entAppSoftware.application.selected$.next(current);
        }
      },
      remove: (index: number) => {
        const current = this.entAppSoftware.application.selected$.value;
        const opt = current[index]
        current.splice(index, 1);
        opt.application.selected = false;
        current.sort((a, b) => sortString(a.label, b.label));
        this.entAppSoftware.application.selected$.next(current);
      }
    },
    init: () => {
      this.entAppSoftware.domain.selected$
        .pipe(takeUntil(this.destroyed$))
        .subscribe(domOption => {
          this.entAppSoftware.application.filterString$.next('');
          this.entAppSoftware.application.options$.next(domOption?.applications ?? [])
        });

      combineLatest([
        this.entAppSoftware.application.filterString$,
        this.entAppSoftware.application.options$
      ]).pipe(
        takeUntil(this.destroyed$),
        map(([filter, options]) => {
          const f = filter.toLowerCase();
          return options.filter(opt => opt.label.toLowerCase().includes(f))
        }),
      ).subscribe(this.entAppSoftware.application.filteredOptions$);
    },
    next: () => {
      this.step$.next('primary role')
    }
  } as const;

  readonly primaryRole = {
    selected$: new BehaviorSubject<SelectableOption | null>(null),
    options: SOFTWARE_ROLES.sort(sortString).map(o => ({ value: o, selected: false, label: o, title: o })),
    select: (value: SelectableOption) => {
      this.primaryRole.options.forEach(o => o.selected = false);
      value.selected = true;
      this.primaryRole.selected$.next(value)
    },
    next: () => this.step$.next('need dev')
  } as const;

  readonly devSkills = {
    need: {
      selected$: new BehaviorSubject<SelectableOption | null>(null),
      options: [
        { value: 'yes', label: 'YES', title: 'YES', selected: false },
        { value: 'no', label: 'NO', title: 'NO', selected: false }
      ] as SelectableOption[],
      select: (value: SelectableOption) => {
        this.devSkills.need.options.forEach(o => o.selected = false);
        value.selected = true;
        this.devSkills.need.selected$.next(value);
      }
    }
  }

  readonly projectType = {
    selected$: new BehaviorSubject<ProjectType | null>(null),
    select: (value: ProjectType) => {
      this.projectType.selected$.next(value);
    },
    options: [
      {
        value: 'new',
        label: `It's a new project (from scratch)`
      },
      {
        value: 'existing',
        label: `It's an existing project (looking for additional help)`
      }
    ]
  } as const;

  readonly companyInfo = {
    form: new FormGroup({
      name: new FormControl('', { validators: [Validators.required] }),
      summary: new FormControl('', { validators: [Validators.required] }),
      logo: new FormControl(null, { validators: [Validators.required] }),
      industryGroup: new FormControl('', { validators: [Validators.required] }),
      industry: new FormControl({ value: '', disabled: true }, { validators: [Validators.required] }),
      productsAndServices: new FormControl('', { validators: [Validators.required] })
    }),
    options: {
      industryGroup$: new BehaviorSubject<string[]>([]),
      industry$: new BehaviorSubject<string[]>([]),
    },
    industryGroupMap: new Map<string, string[]>(),
    init: () => {
      const industryGroups = industryData.industryGroup.map(i => i.value);
      const igMap = this.companyInfo.industryGroupMap;
      igMap.clear();
      industryData.industry.forEach(i => {
        if (!igMap.has(i.group)) {
          igMap.set(i.group, [])
        }
        igMap.get(i.group)?.push(i.value);
      });

      this.companyInfo.form.get('industryGroup')?.valueChanges
        .pipe(
          takeUntil(this.destroyed$),
          map(v => this.companyInfo.industryGroupMap.get(v)!),
          tap(async () => {
            const industry = this.companyInfo.form.get('industry')!;
            if (industry.disabled)
              industry.enable();
            // await next tick
            await sleep();
            industry.setValue(null);
          })
        )
        .subscribe(this.companyInfo.options.industry$)

      this.companyInfo.form.get('logo')?.valueChanges
        .pipe(takeUntil(this.destroyed$))
        .subscribe(v => console.debug(v))

      this.companyInfo.options.industryGroup$.next(industryGroups);
    },
  } as const;

  readonly commonOptions = {
    yearsOfExperience: new Array(20).fill(0).map((_, i) => i + 1),
    expertise: [
      { value: 'fresher', label: 'Fresher' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' }
    ]
  } as const;

  private getDomainOptions() {
    this.loading$.add('getting domain options');
    this.http.get('talentProfile/getTalentProfileSteps')
      .subscribe(
        res => {
          if (res.status === true) {
            this.domainDictionary = res.talentProfile as DomainDictionary;

            const pdOptions: PrimaryDomainOption[] = [];
            const softDomainOptions: SoftwareDomainOption[] = [];

            Object.keys(this.domainDictionary).forEach(dk => {
              const domain = this.domainDictionary[dk];

              pdOptions.push({
                short: dk,
                long: domain['Primary Domain'],
                selected: false
              });

              softDomainOptions.push({
                label: dk,
                value: dk,
                title: domain['Primary Domain'],
                selected: false,
                applications: Object.keys(domain.Modules)
                  .map(mk => {
                    const products = domain.Modules[mk].Product;
                    return products.map((p, i) => {
                      // if (!p.name)
                      //   console.debug('invalid product', p, `${dk}.Modules.${mk}.Product.${i}`);

                      const opt: SelectableOption = { label: p.name, selected: false, title: p.name, value: p.name }
                      return opt;
                    })
                  })
                  .reduce((p, c) => {
                    p.push(...c);
                    return p;
                  }, [])
              });
            });

            pdOptions.sort((a, b) => sortString(a.short, b.short));
            softDomainOptions.sort((a, b) => sortString(a.label, b.label));
            softDomainOptions.forEach(sdo => {
              sdo.applications.sort((a, b) => sortString(a.label, b.label));
            });

            this.entAppDomain.options$.next(pdOptions);
            this.entAppSoftware.domain.options$.next(softDomainOptions);
          }
          else throw new Error('api error - please check network logs');

          this.loading$.delete('getting domain options');
        })
  }

  private disableNextWhenRequired() {
    combineLatest([
      this.isLoading$,
      this.step$,
      this.entAppDomain.selected$,
      this.entAppSoftware.application.selected$,
      this.primaryRole.selected$,
      this.projectType.selected$,
      this.companyInfo.form.statusChanges.pipe(startWith('INVALID')),
    ]).pipe(
      takeUntil(this.destroyed$),
      map(([
        loading,
        step,
        entAppDomains,
        entAppSoftware,
        primaryRole,
        projectType,
        companyInfoStatus,
      ]) => {
        if (loading)
          return true;

        switch (step) {
          case 'enterprise application domain':
            return entAppDomains.length === 0;
          case 'enterprise application software':
            return entAppSoftware.length === 0;
          case 'primary role':
            return primaryRole === null;
          case 'project type':
            return projectType === null;
          case 'company info':
            return companyInfoStatus !== 'VALID';
          default: return false;
        }
      })).subscribe(this.stepper.next.disabled$)
  }

  // this is to pre-fill the form when in dev mode so that
  // we can skip to later steps easily
  private async devModeInit() {
    if (environment.production)
      return;

    const revert = [] as (() => void)[];

    {
      await this.isLoading$.pipe(first(l => l === false)).toPromise();
      this.stepper.next.click('start');
    }

    {
      const pdo = this.entAppDomain.options$.value;
      const erpDomain = pdo.find(o => o.short === 'ERP');
      const aiDomain = pdo.find(o => o.short === 'AI');
      if (!erpDomain)
        throw new Error(`cannot find domain 'ERP'`);
      if (!aiDomain)
        throw new Error(`cannot find domain 'AI'`);
      this.entAppDomain.select(erpDomain);
      this.entAppDomain.select(aiDomain);
      this.stepper.next.click('enterprise application domain');
    }

    {
      const domOpts = this.entAppSoftware.domain.options$.value;
      const erpDomain = domOpts.find(o => o.value === 'ERP');
      if (!erpDomain)
        throw new Error(`cannot find domain 'ERP'`);

      this.entAppSoftware.domain.select(erpDomain);

      const softOptions = this.entAppSoftware.application.options$.value;
      this.entAppSoftware.application.select(softOptions[0]);
      this.entAppSoftware.application.select(softOptions[1]);
      this.entAppSoftware.application.select(softOptions[2]);

      this.stepper.next.click('enterprise application software');
    }

    {
      const logoControl = this.companyInfo.form.get('logo')!;
      const vald = logoControl.validator;
      logoControl.setValidators([]);
      revert.push(() => {
        logoControl.setValidators(vald);
        logoControl.updateValueAndValidity();
      });
      this.companyInfo.form.setValue({
        name: 'Test',
        summary: 'Test',
        logo: null,
        industryGroup: 'Advertising',
        industry: '',
        productsAndServices: 'Test'
      });

      await sleep();
      this.companyInfo.form.patchValue({
        industry: 'Ad Network'
      });
      const firstOpt = this.primaryRole.options[0];
      this.primaryRole.select(firstOpt);

      this.stepper.next.click('company info');
      this.stepper.next.click('primary role');
    }


    revert.forEach(action => action());
  }

  ngOnInit() {
    this.getDomainOptions();

    this.disableNextWhenRequired();
    this.entAppDomain.init();
    this.entAppSoftware.init();
    this.companyInfo.init();

    this.devModeInit();
  }

  async triggerDropdownOnFocus(event: FocusEvent) {
    await sleep();
    if (event.target) {
      const el = event.target as HTMLElement;
      const sib = el.nextElementSibling;
      if (sib) {
        const cl = sib.classList;
        if (cl.contains('dropdown-menu') && !cl.contains('show'))
          el.click();
      }
    }
  }
}

type Step =
  'start' |
  'enterprise application domain' |
  'enterprise application software' |
  'primary role' |
  'need dev' |
  'project type' |
  'company info';

type LoadingStates = 'getting domain options';

interface PrimaryDomainOption {
  short: string;
  long: string;
  selected: boolean;
}

interface SelectableOption {
  value: string;
  label: string;
  title: string;
  selected: boolean;
}


interface SoftwareDomainOption extends SelectableOption {
  applications: SelectableOption[];
}

interface SelectedSoftware {
  domain: SoftwareDomainOption;
  application: SelectableOption;
  label: string;
}

const SOFTWARE_ROLES = [
  'Developer',
  'Solution Architect',
  'Project Manager',
  'Enterprise Architect',
  'Support Analyst'
];

const COMPANY_SIZES = [
  'Less than 10',
  '11 - 50',
  '51 - 200',
  '201 - 1000',
  'More than 1000'
] as const;
type CompanySize = typeof COMPANY_SIZES[number];

type ProjectType = 'new' | 'existing';