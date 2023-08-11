import { ChangeDetectionStrategy, Component, HostBinding, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployerApi } from '@easworks/app-shell/api/employer.api';
import { AuthState } from '@easworks/app-shell/state/auth';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { EmployerProfile } from '@easworks/models';

@Component({
  standalone: true,
  selector: 'employer-profile-page',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  "description": "some description",
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
