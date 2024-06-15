import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, HostBinding, computed, inject, input } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { AuthState } from '@easworks/app-shell/state/auth';
import { JobPost } from '@easworks/models';
import { faArrowLeft, faArrowRight, faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'employer-view-job-post',
  templateUrl: './view-job-post.page.html',
  styleUrl: './view-job-post.page.less',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    MatPseudoCheckboxModule,
    MatCheckboxModule,
    FormImportsModule,
    MatAutocompleteModule,
    MatSelectModule,
    TextFieldModule,
    MatExpansionModule,
    RouterModule,
    MatTooltipModule
  ]
})
export class ViewJobPostPageComponent {

  @HostBinding() private readonly class = 'page';

  protected readonly icons = {
    faArrowLeft,
    faArrowRight,
    faEdit
  } as const;

  private readonly state = inject(AuthState);

  protected readonly jobPost$ = input.required<JobPost>({ alias: 'jobPost' });

  protected readonly user$ = this.state.guaranteedUser();

  protected readonly header$ = computed(() => {
    const job = this.jobPost$();
    const role = job.domain.roles;
    const software = role.software;

    let title: string;
    let subtitle: string;

    if (role.software.length === 1) {
      title = `${software[0]} ${role.role} for ${job.domain.key}`;
      subtitle = `${role.years} years of experience`;
    }
    else {
      title = `${role.role} for ${job.domain.key}`;
      subtitle = `${role.years} years of experience | ${software.join(' | ')}`;
    }

    return {
      title,
      subtitle
    } as const;
  });

  protected readonly techGroups$ = computed(() => this.jobPost$().tech);

  protected readonly primaryDomainExpertise$ = computed(() => {
    const primaryDomain = this.jobPost$();

    const arrOfExpertise: { key: string, value: string, url: string; }[] = [
      {
        key: `Expertise in ${primaryDomain.domain.key}:`,
        url: 'services',
        value: primaryDomain.domain.services.join(', ')
      },
      {
        key: `${primaryDomain.domain.key} Module Expertise:`,
        url: 'modules',
        value: primaryDomain.domain.modules.join(', ')
      }
    ];

    return {
      domainExpertise: arrOfExpertise
    };
  });


  protected readonly jobSpecifics$ = computed(() => {
    const jobSpecificesDetail = this.jobPost$();

    return {
      projectType: jobSpecificesDetail.projectType,
      experience: jobSpecificesDetail.requirements.experience,
      noOfHours: jobSpecificesDetail.requirements.commitment,
      engagementPeriod: jobSpecificesDetail.requirements.engagementPeriod,
      hourlyBudget: jobSpecificesDetail.requirements.hourlyBudget,
      startTimeLine: jobSpecificesDetail.requirements.projectKickoff,
      remoteWork: jobSpecificesDetail.requirements.remote,
      jobPostStatus: jobSpecificesDetail.status
    } as const;
  });

  protected readonly role = (() => {
    const $ = computed(() => this.user$().role || 'public');
    const freelancer$ = computed(() => $() === 'freelancer');
    const employer$ = computed(() => $() === 'employer');
    const admin$ = computed(() => $() === 'admin');

    return { $, freelancer$, employer$, admin$ } as const;
  })();



  protected readonly isEditable$ = computed(() => {
    const role = this.role.$();
    const status = this.jobPost$().status;

    return status === 'Awaiting Approval' && role === 'employer';
  });
}