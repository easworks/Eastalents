import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, INJECTOR, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { UI_FEATURE } from '@easworks/app-shell/state/ui';
import { Store } from '@ngrx/store';
import { AppHeaderComponent } from './header/app-header.component';

@Component({
  standalone: true,
  selector: 'easworks-accounts-client-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    RouterModule,
    AppHeaderComponent
  ]
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly injector = inject(INJECTOR);
  private readonly dRef = inject(DestroyRef);


  private readonly ui$ = this.store.selectSignal(UI_FEATURE.selectUiState);

  protected readonly navigating$ = computed(() => this.ui$().navigating);

  ngOnInit() {
  }
}
