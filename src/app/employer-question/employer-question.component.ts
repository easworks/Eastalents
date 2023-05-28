import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { first, map, shareReplay, startWith } from 'rxjs/operators';
import { LoadingState } from '../_helpers/loading-state';
import { DomainDictionary } from '../_models/domain';
import { HttpService } from '../_services/http.service';
import { environment } from 'src/environments/environment';

type Step =
  'start' |
  'enterprise application domain' |
  'enterprise application software';

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

@Component({
  selector: 'employer-question',
  templateUrl: './employer-question.component.html',
  styleUrls: ['./employer-question.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployerQuestionComponent implements OnInit {
  constructor(
    private readonly http: HttpService
  ) { }

  private domainDictionary!: DomainDictionary;

  readonly loading$ = new LoadingState(new Set<LoadingStates>());
  readonly isLoading$ = this.loading$.size$.pipe(map(v => v > 0), shareReplay(1));

  readonly step$ = new BehaviorSubject<Step>('start');

  readonly stepper = {
    totalSteps: 2,
    showControls$: this.step$.pipe(map(s => s !== 'start'), shareReplay(1)),
    progress$: this.step$.pipe(
      map(s => {
        switch (s) {
          case 'enterprise application domain': return 1;
          case 'enterprise application software': return 2;
          default: return null;
        }
      }),
      shareReplay(1)
    ),
    previous: {
      visible$: this.step$.pipe(map(s => s !== 'enterprise application domain'), shareReplay(1)),
      click: (step: Step) => {
        switch (step) {
          case 'enterprise application software': this.step$.next('enterprise application domain'); break;
        }
      }
    },
    skip: {
      visible$: this.step$.pipe(map(s => false), shareReplay(1))
    },
    next: {
      disabled$: new BehaviorSubject(false),
      click: (step: Step) => {
        switch (step) {
          case 'start': this.step$.next('enterprise application domain'); break;
          case 'enterprise application domain': this.entAppDomain.next(); break;
        }
      }
    }
  } as const;

  readonly entAppDomain = {
    filterString$: new BehaviorSubject(''),
    gettingOptions$: this.loading$.has$('getting domain options'),
    options$: new BehaviorSubject<PrimaryDomainOption[]>([]),
    filteredOptions$: new BehaviorSubject<PrimaryDomainOption[]>([]),
    form: new FormGroup({
      domain: new FormControl(null, { validators: [Validators.required] }),
      yearsOfExperience: new FormControl(null, { validators: [Validators.required] }),
      expertise: new FormControl(null, { validators: [Validators.required] })
    }),
    init: () => {
      combineLatest([
        this.entAppDomain.filterString$,
        this.entAppDomain.options$
      ]).pipe(
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
      const all = this.entAppDomain.options$.value;
      all.forEach(opt => opt.selected = false);
      value.selected = true;

      this.entAppDomain.form.setValue({
        domain: value,
        yearsOfExperience: null,
        expertise: null
      });
      this.entAppDomain.filterString$.next('');
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
      options$: new BehaviorSubject<SelectableOption[]>([])
    },
    init: () => {
      this.entAppSoftware.domain.selected$
        .subscribe(domOption => {
          this.entAppSoftware.application.options$.next(domOption?.applications ?? [])
        })
    }
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
      this.entAppDomain.form.statusChanges.pipe(startWith('INVALID'))
    ]).pipe(map(([
      loading,
      entApptatus,
    ]) => {
      return loading ||
        entApptatus !== 'VALID';
    })).subscribe(this.stepper.next.disabled$)
  }

  // this is to pre-fill the form when in dev mode so that
  // we can skip to later steps easily
  private async devModeInit() {
    if (environment.production)
      return;

    await this.isLoading$.pipe(first(l => l === false)).toPromise();

    const pdo = this.entAppDomain.options$.value;
    const erpDomain = pdo.find(o => o.short === 'ERP');
    if (!erpDomain)
      throw new Error(`cannot find domain 'ERP'`);
    this.entAppDomain.select(erpDomain);
    this.entAppDomain.form.patchValue({
      yearsOfExperience: 10,
      expertise: 'advanced'
    });
    this.stepper.next.click('enterprise application domain');

    const domOpts = this.entAppSoftware.domain.options$.value;
    const erpDomain2 = domOpts.find(o => o.value === 'ERP');
    if (!erpDomain2)
      throw new Error(`cannot find domain 'ERP'`);

    this.entAppSoftware.domain.select(erpDomain2);
  }

  ngOnInit() {
    this.getDomainOptions();

    this.disableNextWhenRequired();
    this.entAppDomain.init();
    this.entAppSoftware.init();

    this.devModeInit();
  }

  async triggerDropdownOnFocus(event: FocusEvent) {
    await new Promise(resolve => setTimeout(resolve, 100));
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