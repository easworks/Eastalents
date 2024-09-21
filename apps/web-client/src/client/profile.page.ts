import { ChangeDetectionStrategy, Component, HostBinding, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { authFeature } from '@easworks/app-shell/state/auth';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { EmployerProfile } from '@easworks/models';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';

@Component({
  standalone: true,
  selector: 'employer-profile-page',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule
  ]
})
export class EmployerProfilePageComponent {
  constructor() {
    this.route.data.pipe(takeUntilDestroyed())
      .subscribe(data => {
        this.data.profile$.set(data['profile']);
      });
  }
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly snackbar = inject(MatSnackBar);

  private readonly user$ = this.store.selectSignal(authFeature.guaranteedUser);

  protected readonly icons = { faUser } as const;
  @HostBinding() private readonly class = 'page';

  protected readonly loading = generateLoadingState<[
    'loading profile'
  ]>();
  protected readonly isLoadingProfile$ = this.loading.has('loading profile');

  protected readonly data = this.initData();

  private initData() {
    const profile$ = signal<EmployerProfile | null>(null);

    return {
      profile$
    };
  }
}
