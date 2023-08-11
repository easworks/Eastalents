import { ChangeDetectionStrategy, Component, HostBinding, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployerApi } from '@easworks/app-shell/api/employer.api';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { AuthState } from '@easworks/app-shell/state/auth';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { EmployerProfile } from '@easworks/models';
import { faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  selector: 'employer-profile-page',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule
  ]
})
export class EmployerProfilePageComponent {
  constructor() {
    this.getProfile();
  }

  private readonly api = {
    employer: inject(EmployerApi)
  } as const;

  private readonly user$ = inject(AuthState).guaranteedUser();
  private readonly snackbar = inject(MatSnackBar);

  protected readonly icons = { faUser } as const;
  @HostBinding() private readonly class = 'page';

  protected readonly loading = generateLoadingState<[
    'loading profile'
  ]>();
  protected readonly isLoadingProfile$ = this.loading.has('loading profile');

  protected readonly data = this.initData();

  private getProfile() {
    this.loading.add('loading profile');
    const user = this.user$();

    // TODO: use actual profile data
    // this.api.talent.profile.get(user._id)
    //   .then(r => this.data.profile$.set(r))
    //   .catch(e => {
    //     this.snackbar.openFromComponent(SnackbarComponent, {
    //       ...ErrorSnackbarDefaults,
    //       data: { message: e.message }
    //     });
    //   })
    //   .finally(() => this.loading.delete('loading profile'));

    this.data.profile$.set(dummyData);
    this.loading.delete('loading profile');
  }

  private initData() {
    const profile$ = signal<EmployerProfile | null>(null);

    return {
      profile$
    };
  }
}

const dummyData: EmployerProfile = {
  "_id": "646fa97b9f56f3d874be2ae3",
  "orgName": "some name",
  "description": `Step into excellence with XYZ Corporation, an industry pacesetter renowned for innovation and impact. With a storied history of pioneering solutions on a global scale, our distinguished team drives us towards new horizons collaboratively.

  At XYZ Corporation, innovation is embedded within our core. Our legacy includes breakthroughs spanning AI advancements to sustainable energy triumphs. As a vital part of our accomplished ensemble, you will be at the forefront of defining the future.
  
  Elevating careers is our forte. As part of our esteemed company, you'll experience unparalleled growth and advancement opportunities. Our array of resources, including mentorship initiatives, workshops, and access to premier conferences, propels your career journey.
  
  Our thriving culture is the cornerstone of our triumphs. Inclusivity, diversity, and empowerment are not mere buzzwords; they are integral to our triumphs. We offer a conducive work environment, where your unique insights continue to fuel our continued success.
  
  Balancing work and life is paramount. Our flexible policies prioritize your well-being, while our state-of-the-art facilities set the stage for your accomplishments. Beyond being a workplace, XYZ Corporation is your professional family.
  
  Forge your path with XYZ Corporation, an eminent frontrunner poised to redefine possibilities. Your contributions will catalyze industries and inspire generations. Align your aspirations with us, and be part of a legacy that reshapes the world.
  
  XYZ Corporation, a vanguard in the industry, invites you to make your mark. Here, you'll be part of a peerless collective, conquering extraordinary challenges and propelling progress. Your journey to success finds its ideal beginning here.
  
  Embark on a transformative journey with us at XYZ Corporation, where brilliance thrives. Join a team that has etched its name in industries, influenced communities, and nurtured careers. As you contribute, your potential will amplify, setting new benchmarks for excellence.`,
  "orgType": "Enterprise",
  "orgSize": "1 - 10 Employees",
  "industry": {
    "group": "Administrative Services",
    "name": "Archiving Service"
  },
  "software": [
    {
      "domain": "Artificial Intelligence (AI)",
      "products": [
        "ABBYY",
        "Sift Science"
      ]
    },
    {
      "domain": "Application Lifecycle Management (ALM)",
      "products": [
        "CA Agile Central (Broadcom)"
      ]
    }
  ],
  "contact": {
    "email": "dd@dd.com",
    "phone": null,
    "website": null
  },
  "location": {
    "country": "Aland Islands",
    "state": null,
    "city": null,
    "timezone": "Europe/Mariehamn"
  }
};
