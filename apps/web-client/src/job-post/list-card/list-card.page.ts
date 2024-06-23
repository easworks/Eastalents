import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, HostBinding, Input, computed, inject, input, signal } from '@angular/core';
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
import { faBookBookmark, faBookmark, faSave } from '@fortawesome/free-solid-svg-icons';

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


    @Input({ required: true, }) cardData!: JobPostCard;


}