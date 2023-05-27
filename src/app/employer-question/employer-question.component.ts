import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from '../_services/http.service';
import { DomainDictionary } from '../_models/domain';
import { LoadingState } from '../_helpers/loading-state';
import { map } from 'rxjs/operators';

type Step =
  'start' |
  'enterprise application domain';

type LoadingStates = 'getting domain options';

interface PrimaryDomainOption {
  short: string;
  long: string;
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

  readonly step$ = new BehaviorSubject<Step>('start');

  readonly loading$ = new LoadingState(new Set<LoadingStates>());

  readonly isLoading$ = this.loading$.size$.pipe(map(v => v > 0));

  readonly start = {
    next: () => this.step$.next('enterprise application domain')
  } as const;

  readonly entAppDomain = {
    filterString: new BehaviorSubject(''),
    gettingOptions$: this.loading$.has$('getting domain options'),
    options$: new BehaviorSubject<PrimaryDomainOption[]>([])
  };

  private getDomainOptions() {
    this.loading$.add('getting domain options');
    this.http.get('talentProfile/getTalentProfileSteps')
      .subscribe(
        res => {
          if (res.status === true) {
            const dict = res.talentProfile as DomainDictionary;

            const pdOptions = Object.keys(dict).map(k => {
              const opt: PrimaryDomainOption = {
                short: k,
                long: dict[k]['Primary Domain']
              };
              return opt;
            });

            this.entAppDomain.options$.next(pdOptions);
          }
          else throw new Error('api error - please check network logs');

          this.loading$.delete('getting domain options');
        })
  }

  ngOnInit() {
    this.getDomainOptions();
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