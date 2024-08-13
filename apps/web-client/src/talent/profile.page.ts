import { ChangeDetectionStrategy, Component, HostBinding, computed, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TalentApi } from '@easworks/app-shell/api/talent.api';
import { ChartJsDirective } from '@easworks/app-shell/common/chart-js/chart-js.directive';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { authFeature } from '@easworks/app-shell/state/auth';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { getTailwindColor } from '@easworks/app-shell/utilities/get-runtime-color';
import { sortString } from '@easworks/app-shell/utilities/sort';
import { FreelancerProfile } from '@easworks/models';
import { faPenToSquare, faUser } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
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

  private readonly store = inject(Store);
  private readonly snackbar = inject(MatSnackBar);

  private readonly user$ = this.store.selectSignal(authFeature.guaranteedUser);

  protected readonly icons = { faUser, faPenToSquare } as const;

  protected readonly data = this.initData();

  @HostBinding() private readonly class = 'page';

  protected readonly loading = generateLoadingState<[
    'loading profile'
  ]>();
  protected readonly isLoadingProfile$ = this.loading.has('loading profile');

  private getProfile() {
    this.loading.add('loading profile');

    // TODO: use actual profile data
    // this.api.talent.profile.get()
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
    const profile$ = signal<FreelancerProfile | null>(null);

    return {
      profile$,
      basic$: computed(() => {
        const p = profile$();
        const u = this.user$();

        if (!p)
          return null;

        let location: string;
        {
          const { city, state, country } = p.personalDetails.location;
          location = [city, state, country]
            .filter(i => !!i)
            .join(', ');
        }


        return {
          name: `${u.firstName} ${u.lastName}`,
          image: p.personalDetails.image,
          currentRole: p.professionalDetails.currentRole,
          location,
          preferredRoles: p.workPreference.roles.flatMap(i => i.roles),
        };
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

        const percentage = completed * 100;

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
          ['Work Skill Assessment (WSA)', completion.wsa]
        ];

        const indicators = data.map(([label, percentage]) => ({ label, percentage }));
        indicators.forEach(i => i.percentage = i.percentage * 100);
        return indicators;
      }),
      domains$: computed(() => profile$()?.experience.domains
        .map(d => ({
          key: d.key,
          years: d.years
        }))),
      software$: computed(() => profile$()?.experience.domains
        .flatMap(d => d.products)
        .map(p => ({
          key: p.key,
          years: p.years
        }))
        .sort((a, b) => sortString(a.key, b.key))
      ),
      modules$: computed(() => profile$()?.experience.domains
        .flatMap(d => d.modules)
        .sort(sortString)
      ),
      services$: computed(() => profile$()?.experience.domains
        .flatMap(d => d.services)
        .sort((a, b) => sortString(a.key, b.key))
      ),
      contact$: computed(() => {
        const p = profile$();
        if (!p)
          return undefined;
        let address: string | null = null;
        {
          const input = p.personalDetails.contact.address;
          if (input) {
            address = [
              input.line1,
              input.line2,
              input.city,
              input.state,
              input.country,
              input.postalCode
            ].filter(i => !!i).join(', ');
          }
        }

        const timezone = p.personalDetails.location.timezone;
        const phone = p.personalDetails.contact.phone;
        const social = p.personalDetails.social;
        const email = p.personalDetails.contact.email;

        return {
          address,
          timezone,
          email,
          phone,
          social
        };
      })
    } as const;
  }
}

const dummyData: FreelancerProfile = {
  "_id": "6481a3caf1e4e196271d0979",
  "personalDetails": {
    "firstName": "ram",
    "lastName": "indalkar",
    "image": null,
    "resume": null,
    "citizenship": "India",
    "signupReason": null,
    "contact": {
      "address": null,
      "email": "stevejohn121@gmail.com",
      "phone": {
        "mobile": null,
        "whatsapp": null,
        "telegram": null
      }
    },
    "social": {
      "github": null,
      "linkedin": null,
      "gitlab": null
    },
    "location": {
      "country": "India",
      "state": "West Bengal",
      "city": "Kolkata",
      "timezone": "Asia/Kolkata"
    },
    "education": [
      {
        "qualification": "Some Qualification",
        "specialization": "Some Specialization",
        "duration": {
          "start": 2018,
          "end": 2021
        },
        "institution": "Some institute",
        "location": "Some city, Some state, Some country"
      }
    ]
  },
  "professionalDetails": {
    "overallExperience": "2 to 5 years",
    "currentRole": "Analyst",
    "englishProficiency": "Basic",
    "summary": "some professional summary",
    "portfolio": null,
    "history": [
      {
        "role": "Analyst",
        "duration": {
          "start": 2023,
          "end": null
        },
        "client": "Client 1",
        "skills": "Skill 1",
        "domain": "SCM"
      }
    ],
    "wasFreelancer": true
  },
  "workPreference": {
    "searchStatus": "Active",
    "interest": [
      "Short Term Freelance/Contract"
    ],
    "rates": {
      "hourly": null,
      "monthly": null,
      "annually": null
    },
    "time": {
      "timezone": "Asia/Kolkata",
      "start": "08 PM",
      "end": "02 AM"
    },
    "availability": "Immediately",
    "commitment": [
      "Full-time (40hrs/week)"
    ],
    "roles": [
      {
        "domain": "SCM",
        "roles": [
          "Analyst",
          "Back-end Developer"
        ]
      }
    ]
  },
  "experience": {
    "domains": [
      {
        "key": "SCM",
        "years": 2,
        "modules": [
          "Advanced Planning and Scheduling",
          "Contract Lifecycle Management"
        ],
        "services": [
          {
            "key": "Cloud-based SCM Solutions and Deployment",
            "years": 2
          },
          {
            "key": "Compliance and Regulatory Support for SCM",
            "years": 3
          }
        ],
        "products": [
          {
            "key": "BluJay Solutions",
            "years": 2
          }
        ],
        "roles": [
          {
            "key": "Analyst",
            "years": 2
          },
          {
            "key": "Back-end Developer",
            "years": 3
          }
        ]
      }
    ],
    "tech": [
      {
        "group": "Administration",
        "items": [
          "BluJay Solutions Admin Console"
        ]
      },
      {
        "group": "APIs",
        "items": [
          "BluJay Solutions API"
        ]
      },
      {
        "group": "Client-side customization",
        "items": [
          "CSS",
          "HTML",
          "JavaScript"
        ]
      },
      {
        "group": "Configuration",
        "items": [
          "BluJay Solutions Configuration Manager"
        ]
      },
      {
        "group": "Dashboard and Reporting Tools",
        "items": [
          "BluJay Solutions Analytics"
        ]
      },
      {
        "group": "Data Migration Utilities",
        "items": [
          "BluJay Solutions Data Migration Tool"
        ]
      },
      {
        "group": "Database",
        "items": [
          "Microsoft SQL Server",
          "Oracle Database"
        ]
      },
      {
        "group": "DevOps Integration Tools",
        "items": [
          "Azure DevOps",
          "Bamboo",
          "CircleCI",
          "GitLab",
          "Jenkins"
        ]
      },
      {
        "group": "Frameworks",
        "items": [
          "AngularJS",
          "Spring Framework"
        ]
      },
      {
        "group": "Integration Type",
        "items": [
          "API-based integration",
          "EDI integration"
        ]
      },
      {
        "group": "Middleware and Integration Technologies",
        "items": [
          "Dell Boomi",
          "MuleSoft"
        ]
      },
      {
        "group": "Programming Language",
        "items": [
          "Java",
          "JavaScript"
        ]
      },
      {
        "group": "Server-side customization",
        "items": [
          "Java",
          "Spring Framework"
        ]
      }
    ],
    "industries": [
      {
        "group": "Administrative Services",
        "items": [
          "Archiving Service",
          "Call Center",
          "Collection Agency"
        ]
      },
      {
        "group": "Advertising",
        "items": [
          "Ad Exchange"
        ]
      }
    ]
  },
  "profileCompletion": {
    "overall": 0,
    "summary": 0,
    "easExperience": 0,
    "easSystemPhases": 0,
    "jobRole": 0,
    "experience": 0,
    "techStacks": 0,
    "jobSearchStatus": 0,
    "rates": 0,
    "about": 0,
    "social": 0,
    "wsa": 0,
    "completed": false
  }
};
