import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { JobPost } from '@easworks/models';
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


    protected readonly routeData$ = input.required<JobPost[]>({ alias: 'data' });

    protected readonly list$ = computed(() => this.routeData$());

}