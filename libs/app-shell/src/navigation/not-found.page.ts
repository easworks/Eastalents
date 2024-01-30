import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './not-found.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class NotFoundPageComponent {
  @HostBinding()
  private readonly class = 'page grid place-content-center';
}