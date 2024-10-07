import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient} from '@angular/common/http'; 
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { HelpGroup } from '@easworks/app-shell/services/help';
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
// import jsonData from "apps/web-client/src/assets/public/help-center/content/talent/faqs.json";

@Component({
  standalone: true,
  selector: 'help-center-category-page',
  templateUrl: './category.page.html',
  styleUrl: './category.page.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    RouterModule
  ]
})
export class HelpCenterCategoryPageComponent {  

  constructor() {
    const route = inject(ActivatedRoute);
    const http = inject(HttpClient);

    http.get<any[]>('assets/public/help-center/content/talent/faqs.json') 
    .pipe(takeUntilDestroyed())
    .subscribe(faqs => {
      this.faqs$.set(faqs); 
    });

    route.data.pipe(takeUntilDestroyed()).subscribe(d => {
      this.groups$.set(d['groups']);
    });
  }

  protected readonly icons = {
    faCircleArrowRight
  } as const;

  protected readonly groups$ = signal<HelpGroup[]>([]);
  protected readonly faqs$ = signal<any[]>([]); 
}
