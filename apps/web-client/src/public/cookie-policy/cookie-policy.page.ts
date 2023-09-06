import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarkdownDirective } from '@easworks/app-shell/common/markdown.directive';

@Component({
  standalone: true,
  selector: 'cookie-policy-page',
  templateUrl: './cookie-policy.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [],
  imports: [
    MarkdownDirective
  ]
})
export class CookiePolicyPageComponent {
  protected readonly content: string = inject(ActivatedRoute)
    .snapshot.data['content'];

  @HostBinding() private readonly class = 'page py-8';

}
