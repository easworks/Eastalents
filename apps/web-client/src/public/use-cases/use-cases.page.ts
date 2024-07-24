import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { UseCaseRouteData } from './data-v2';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'use-cases-page',
  templateUrl: './use-cases.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    RouterModule
  ]
})
export class UseCasesPageComponent {

  public readonly routeData$ = input.required<UseCaseRouteData>({ alias: 'useCaseData' });

  protected readonly dynamicComponents = {
    hero$: computed(() => this.routeData$().dynamicComponents.hero),
    details$: computed(() => this.routeData$().dynamicComponents.details),
    overview$: computed(() => this.routeData$().dynamicComponents.overview),
    process$: computed(() => this.routeData$().dynamicComponents.process),
  } as const;

}
