import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { JobPost } from '@easworks/models';

@Component({
  selector: 'employer-view-job-post',
  templateUrl: './view-job-post.page.html',
  styleUrls: ['./view-job-post.page.less'],
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
    MatExpansionModule
  ]
})
export class ViewJobPostPageComponent {
  protected readonly jobPost$ = input.required<JobPost>({ alias: 'jobPost' });

  protected readonly header$ = computed(() => {
    const job = this.jobPost$();
    const role = job.domain.roles[0];
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
}