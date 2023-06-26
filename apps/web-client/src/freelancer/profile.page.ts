import { ChangeDetectionStrategy, Component, HostBinding, computed, inject, signal } from '@angular/core';
import { TalentApi } from '@easworks/app-shell/api/talent.api';
import { ChartJsDirective } from '@easworks/app-shell/common/chart-js/chart-js.directive';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { AuthState } from '@easworks/app-shell/state/auth';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { getTailwindColor } from '@easworks/app-shell/utilities/get-runtime-color';
import { FreelancerProfile } from '@easworks/models';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'freelancer-profile-page',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    ChartJsDirective,
    FormImportsModule
  ]
})
export class FreelancerProfilePageComponent {
  constructor() {
    this.getProfile();
  }

  private readonly api = {
    talent: inject(TalentApi)
  } as const;
  private readonly user$ = inject(AuthState).user$;

  protected readonly data = this.initData();

  @HostBinding() private readonly class = 'page';

  protected readonly loading = generateLoadingState<[
    'loading profile'
  ]>();
  protected readonly isLoadingProfile$ = this.loading.has('loading profile');

  private getProfile() {
    this.loading.add('loading profile');
    const user = this.user$();
    if (!user)
      throw new Error('invalid operation');

    this.api.talent.getTalentProfile(user._id)
      .subscribe({
        next: (r) => {
          this.data.profile$.set(r);
          this.loading.delete('loading profile');
        },
        error: () => this.loading.delete('loading profile')
      })
  }

  private initData() {
    const profile$ = signal<FreelancerProfile | null>(null);

    return {
      profile$,
      basic$: computed(() => {
        const p = profile$();
        const u = this.user$();

        if (!p || !u)
          return null;

        return {
          name: `${u.firstName} ${u.lastName}`,
          image: p.image,
          currentRole: p.currentRole,
          location: `${p.location.city}, ${p.location.state}, ${p.location.country}`,
          preferredRole: p.preferredRole,
        }
      }),
      profileCompletionPie$: computed(() => {
        const p = profile$();
        if (!p)
          return null;

        const completed = p.profileCompletion.overall;

        const config: ChartConfiguration = {
          type: 'pie',
          plugins: [],
          options: {
            plugins: { datalabels: { display: false } }
          },
          data: {
            datasets: [{
              data: [1 - completed, completed],
              backgroundColor: [
                getTailwindColor('bg-divider'),
                getTailwindColor('bg-primary')
              ],
              hoverOffset: 4
            }]
          }
        };

        const percentage = completed * 100

        return { percentage, config } as const;
      }),
      profileCompletionBars$: computed(() => {
        const p = profile$();
        if (!p)
          return null;

        const completion = p.profileCompletion;

        const data: [string, number][] = [
          ['Profile Summary', completion.summary],
          ['Top EAS Experience', completion.easExperience],
          ['EAS System Phases Worked', completion.easSystemPhases],
          ['Job Role', completion.jobRole],
          ['Experience', completion.experience],
          ['Technology Stacks', completion.techStacks],
          ['Job Search Status', completion.jobSearchStatus],
          ['Rates', completion.rates],
          ['About Yourself', completion.about],
          ['Social Media Links', completion.social],
          ['Work Skill Assessment (WSA]', completion.wsa]
        ];

        const indicators = data.map(([label, percentage]) => ({ label, percentage }))
        indicators.forEach(i => i.percentage = i.percentage * 100);
        return indicators;
      })
    } as const;
  }


}
