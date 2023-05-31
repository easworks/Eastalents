import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './not-found.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class NotFoundPageComponent {
  @HostBinding('class')
  private readonly class = 'p-4 sm:px-8 grid place-content-center'
}