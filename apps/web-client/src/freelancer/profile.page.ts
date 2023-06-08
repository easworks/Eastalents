import { ChangeDetectionStrategy, Component, HostBinding, computed, inject, signal } from '@angular/core';
import { AuthState, TalentApi, generateLoadingState } from '@easworks/app-shell';
import { FreelancerProfile, FreelancerProfileQuestionDto } from '@easworks/models';

@Component({
  selector: 'freelancer-profile-page',
  templateUrl: './profile.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FreelancerProfilePageComponent {
  constructor() {
    this.getProfile();
  }

  private readonly api = {
    talent: inject(TalentApi)
  } as const;
  private readonly user$ = inject(AuthState).user$;

  private readonly data = this.initData();

  @HostBinding() private readonly class = 'page';

  protected readonly loading = generateLoadingState<[
    'loading profile'
  ]>();

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

      const p: FreelancerProfile = {
        image: null,
        currentRole: '',
        location: '',
        preferredRole: ''
      }

      return p;
    });

    return {
      step$,
      profile$
    } as const;
  }
}