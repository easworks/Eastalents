import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, HostBinding, computed, inject, input, signal } from '@angular/core';
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
import { generateLoadingState } from '@easworks/app-shell/state/loading';
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
  private readonly auth = inject(AuthState);

  @HostBinding() private readonly class = 'page';

  protected readonly icons = {
    faArrowLeft,
    faArrowRight,
    faEdit
  } as const;

  private readonly loading = generateLoadingState<[
    'applying',
    'deleting',
    'canceling'
  ]>();

  protected readonly jobPost$ = input.required<JobPost>({ alias: 'jobPost' });

  protected readonly user$ = this.auth.user$;

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
      workEnvironment: jobSpecificesDetail.requirements.environment,
      jobPostStatus: jobSpecificesDetail.status
    } as const;
  });

  protected readonly role$ = computed(() => this.user$()?.role || 'public');

  protected readonly actions = (() => {
    const permissions$ = computed(() => {
      const user = this.user$();
      const role = this.role$();
      const { status, createdBy } = this.jobPost$();

      const isCreator = user && createdBy === user._id;


      const canApply =
        (role === 'freelancer' ||
          role === 'public') &&
        status === 'Hiring';

      const canEdit =
        isCreator &&
        status === 'Awaiting Approval';

      const canDelete = canEdit;

      const canCancel =
        isCreator &&
        (status === 'Active' ||
          status === 'Hiring' ||
          status === 'In Progress');

      return {
        canApply, canEdit, canDelete, canCancel
      } as const;
    });

    const apply = (() => {
      const allowed$ = computed(() => permissions$().canApply);

      const loading$ = this.loading.has('applying');
      const disabled$ = this.loading.any$;

      const click = () => {
        try {
          this.loading.add('applying');
          console.debug('apply for job-post');
        }
        finally {
          this.loading.delete('applying');
        }
      };

      return {
        allowed$,
        loading$,
        disabled$,
        click
      } as const;
    })();

    const edit = (() => {
      const allowed$ = computed(() => permissions$().canEdit);
      const active$ = signal(false);

      const disabled$ = this.loading.any$;

      const click = () => {
        active$.update(v => !v);
      };

      return {
        allowed$,
        disabled$,
        active$,
        click
      } as const;
    })();

    const deleteJob = (() => {
      const allowed$ = computed(() => permissions$().canDelete);

      const loading$ = this.loading.has('deleting');
      const disabled$ = this.loading.any$;

      const click = () => {
        try {
          this.loading.add('deleting');
          console.debug('delete job-post');
        }
        finally {
          this.loading.delete('deleting');
        }
      };

      return {
        allowed$,
        loading$,
        disabled$,
        click
      } as const;
    })();

    const cancel = (() => {
      const allowed$ = computed(() => permissions$().canCancel);

      const loading$ = this.loading.has('canceling');
      const disabled$ = this.loading.any$;

      const click = () => {
        try {
          this.loading.add('canceling');
          console.debug('cancel job-post');
        }
        finally {
          this.loading.delete('canceling');
        }
      };

      return {
        allowed$,
        loading$,
        disabled$,
        click
      } as const;
    })();

    return {
      apply,
      edit,
      deleteJob,
      cancel
    } as const;

  })();
}