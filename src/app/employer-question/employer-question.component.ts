import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { LoadingState } from '../_helpers/loading-state';
import { DomainDictionary } from '../_models/domain';
import { HttpService } from '../_services/http.service';

type Step =
  'start' |
  'enterprise application domain';

type LoadingStates = 'getting domain options';

interface PrimaryDomainOption {
  short: string;
  long: string;
  selected: boolean;
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
          case 'start': return null;
          case 'enterprise application domain': return 1
        }
      }),
      shareReplay(1)
    ),
    previous: {
      visible$: this.step$.pipe(map(s => false), shareReplay(1))
    },
    skip: {
      visible$: this.step$.pipe(map(s => false), shareReplay(1))
    },
    next: {
      disabled$: new BehaviorSubject(false)
    }
  } as const;

  readonly start = {
    next: () => this.step$.next('enterprise application domain')
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
    initFilter: () => {
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

            const pdOptions = Object.keys(this.domainDictionary).map(k => {
              const opt: PrimaryDomainOption = {
                short: k,
                long: this.domainDictionary[k]['Primary Domain'],
                selected: false
              };
              return opt;
            });

            this.entAppDomain.options$.next(pdOptions);
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

  ngOnInit() {
    this.getDomainOptions();

    this.disableNextWhenRequired();
    this.entAppDomain.initFilter();
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