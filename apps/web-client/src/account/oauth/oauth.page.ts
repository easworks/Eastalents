import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OAuthApi } from '@easworks/app-shell/api/oauth.api';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { generateLoadingState } from '@easworks/app-shell/state/loading';

@Component({
  standalone: true,
  selector: 'oauth-page',
  templateUrl: './oauth.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule
  ]
})
export class OAuthPageComponent {
  constructor() {
    this.signInOtherApp();
  }

  private readonly route = inject(ActivatedRoute);
  private readonly api = {
    oauth: inject(OAuthApi)
  } as const;

  @HostBinding() private readonly class = 'page grid place-content-center';

  protected readonly loading = generateLoadingState<[
    'getting code'
  ]>();

  private signInOtherApp() {
    this.loading.add('getting code');

    // this.route.queryParams
    //   .pipe(
    //     switchMap(params => this.api.oauth.generateCode(params)),
    //     takeUntilDestroyed(),
    //     finalize(() => this.loading.delete('getting code')),
    //   )
    //   .subscribe(result => {
    //     location.href = result;
    //   });
  }
}