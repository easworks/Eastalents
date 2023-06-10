import { ChangeDetectionStrategy, Component, HostBinding, computed, inject, signal } from '@angular/core';
import { AuthState, ChartJsDirective, ImportsModule, TalentApi, generateLoadingState, getTailwindColor } from '@easworks/app-shell';
import { FreelancerProfile, FreelancerProfileQuestionDto } from '@easworks/models';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'freelancer-profile-page',
  templateUrl: './profile.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    ChartJsDirective
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
          console.debug(r);
          this.data.step$.set(r);
          this.loading.delete('loading profile');
        },
        error: () => this.loading.delete('loading profile')
      })
  }

  private initData() {
    const step$ = signal<FreelancerProfileQuestionDto | null>(null);

    const profile$ = computed(() => {
      const step = step$();

      if (!step)
        return null;

      const p: FreelancerProfile = {
        image: null,

        currentRole: step[11].data.currentPLM,
        preferredRole: step[11].data.preferredPLM,

        location: {
          country: step[1].country,
          state: step[1].state,
          city: step[1].city,
        },

        profileCompletion: null as unknown as FreelancerProfile['profileCompletion']
      }

      this.useDummyData(p);

      return p;
    });

    return {
      step$,
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
          location: `${p.location.city}, ${p.location.state.name}, ${p.location.country.name}`,
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
      })
    } as const;
  }

  // THIS FUNCTION IS MEANT TO BE REMOVED
  private useDummyData(profile: FreelancerProfile) {
    profile.location.city = 'Kolkata';
    profile.location.state = { name: 'West Bengal', iso: 'WB' };
    profile.location.country = {
      name: 'India',
      code: 'IN',
      dialcode: '+91',
      currency: 'INR',
      flag: "🇮🇳"
    };

    profile.profileCompletion = {
      about: Math.random(),
      easExperience: Math.random(),
      easSystemPhases: Math.random(),
      experience: Math.random(),
      jobRole: Math.random(),
      jobSearchStatus: Math.random(),
      overall: 0,
      rates: Math.random(),
      social: Math.random(),
      summary: Math.random(),
      techStacks: Math.random(),
      wsa: Math.random()
    };

    profile.profileCompletion.overall = Object.values(profile.profileCompletion)
      .reduce((p, c) => p + c, 0) / 11
  }
}