import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { EngagementPeriod, JobPost, WeeklyCommitment, WorkEnvironment } from '@easworks/models/job-post';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'list-card',
  templateUrl: './list-card.page.html',
  styleUrl: './list-card.page.less',
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
export class ListCardPageComponent {

  protected readonly icons = {
    faBookmark
  } as const;

  public readonly post$ = input.required<JobPost>({ alias: 'post' });

  protected readonly title$ = computed(() => {
    const p = this.post$();
    return `${p.domain.roles.role} for ${p.domain.key}`;
  });

  protected readonly applicants$ = computed(() => this.post$().count.applications);

  protected readonly description = (() => {

    const $ = computed(() => this.post$().description);

    const expanded = {
      $: signal(false),
      toggle: () => expanded.$.update(v => !v)
    };

    return {
      $,
      expanded
    } as const;

  })();

  protected readonly tags$ = computed(() => {
    const p = this.post$();
    const techStack = p.tech.map(t => t.items).flat();
    return [
      p.domain.key,
      ...p.domain.services,
      ...p.domain.modules,
      ...p.domain.roles.software,
      ...techStack
    ];
  });

}


export interface JobPostCard {
  id: number;
  title: string,
  Applicants: string,
  workEnvironment: WorkEnvironment,
  engagementPeriod: EngagementPeriod,
  noOfHours: WeeklyCommitment;
  chipList: string[];
}

// protected readonly jobListView$ = computed(() => {
//     const jobListView = this.list$();

//     const arrOfJobList: JobPostCard[] = [];


//     jobListView.forEach((x, i) => {
//         const techStack = x.tech.map(y => y.items);
//         arrOfJobList.push({
//             id: i + 1, //Replace with id
//             title: `${x.domain.roles.role} for ${x.domain.key}`,
//             Applicants: `${x.count.applications} Applicants`,
//             workEnvironment: x.requirements.environment,
//             engagementPeriod: x.requirements.engagementPeriod,
//             noOfHours: x.requirements.commitment,
//             chipList: [x.domain.key, ...x.domain.services, ...x.domain.modules, ...x.domain.roles.software, ...techStack.flat()],
//         });
//     });

//     return {
//         jobList: arrOfJobList
//     };
// });

