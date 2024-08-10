import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { AuthService } from '@easworks/app-shell/services/auth';

@Component({
  standalone: true,
  selector: 'app-authenticated-header',
  templateUrl: './authenticated-header.component.html',
  styleUrl: './authenticated-header.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule
  ]
})
export class AppAuthenticatedHeaderComponent {
  private readonly auth = inject(AuthService);

  @HostBinding()
  private readonly class = 'block h-full bg-white z-10';

  signOut() {
    this.auth.signOut();
  }
}