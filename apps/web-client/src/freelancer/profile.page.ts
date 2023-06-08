import { ChangeDetectionStrategy, Component, HostBinding, computed, inject, signal } from '@angular/core';
import { AuthState, ImportsModule, TalentApi, generateLoadingState } from '@easworks/app-shell';
import { FreelancerProfile, FreelancerProfileQuestionDto } from '@easworks/models';

@Component({
  selector: 'freelancer-profile-page',
  templateUrl: './profile.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule
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
        }

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

  }
}