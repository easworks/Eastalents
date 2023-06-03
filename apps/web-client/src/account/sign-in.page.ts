import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { ImportsModule } from '@easworks/app-shell';

@Component({
  selector: 'account-sign-in-page',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule
  ]
})
export class AccountSignInPageComponent {
  @HostBinding()
  private readonly class = 'page grid place-content-center';
}