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
import { EngagementPeriod, JobPost, JobPostCard, WeeklyCommitment, WorkEnvironment } from '@easworks/models';
import { faArrowLeft, faArrowRight, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ListCardPageComponent } from '../list-card/list-card.page';

@Component({
    selector: 'employer-list-job-post',
    templateUrl: './list-job-post.page.html',
    styleUrl: './list-job-post.page.less',
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
        MatTooltipModule,
        ListCardPageComponent
    ]
})
export class ListJobPostPageComponent {


    protected readonly listJobPost$ = input.required<JobPost[]>({ alias: 'listJobPost' });

    protected readonly jobListView$ = computed(() => {
        const jobListView = this.listJobPost$();

        const arrOfJobList: JobPostCard[] = [];


        jobListView.forEach((x, i) => {
            const techStack = x.tech.map(y => y.items);
            arrOfJobList.push({
                id: i + 1, //Replace with id
                title: `${x.domain.roles.role} for ${x.domain.key}`,
                Applicants: `${x.count.applications} Applicants`,
                workEnvironment: x.requirements.environment,
                engagementPeriod: x.requirements.engagementPeriod,
                noOfHours: x.requirements.commitment,
                chipList: [x.domain.key, ...x.domain.services, ...x.domain.modules, ...x.domain.roles.software, ...techStack.flat()],
            });
        });

        return {
            jobList: arrOfJobList
        };
    });

}