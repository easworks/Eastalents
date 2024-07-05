import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, HostBinding, INJECTOR, OnInit, computed, effect, inject, input } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { JobPost } from '@easworks/models';
import { ListCardPageComponent } from '../list-card/list-card.page';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';

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
        ListCardPageComponent,
        MatTabsModule,
    ],
})
export class ListJobPostPageComponent implements OnInit {

    @HostBinding() private readonly class = 'page';

    private readonly injector = inject(INJECTOR);

    private readonly router = inject(Router);

    protected readonly routeData$ = input.required<JobPost[]>({ alias: 'data' });
    protected readonly editTab$ = input<Tab | null>(null, { alias: 'tab' });

    protected readonly list$ = computed(() => this.routeData$());

    protected selectedIndex = 0;


    ngOnInit(): void {

        effect(() => {
            const tab = this.editTab$();

            if (tab === "Applied") {
                this.selectedIndex = 1;
            }
            else {
                this.selectedIndex = 0;
            }


        }, { injector: this.injector });
    }


    SelectedTabChange(event: MatTabChangeEvent) {
        console.log(event);
        const url = `job-post/list/${event.tab.textLabel}`;
        this.router.navigateByUrl(url);
    }
}

type Tab = 'Available' | 'Applied';