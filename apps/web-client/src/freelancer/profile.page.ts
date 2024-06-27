import { ChangeDetectionStrategy, Component, HostBinding, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { AuthState } from '@easworks/app-shell/state/auth';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { EmployerProfile } from '@easworks/models';
import { faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  selector: 'Talent-profile-page',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule
  ]
})
export class TalentProfilePageComponent {
  constructor() {
    this.route.data.pipe(takeUntilDestroyed())
      .subscribe(data => {
        this.data.profile$.set(data['profile']);
      });
  }
  private readonly route = inject(ActivatedRoute);
  private readonly user$ = inject(AuthState).guaranteedUser();
  private readonly snackbar = inject(MatSnackBar);

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
