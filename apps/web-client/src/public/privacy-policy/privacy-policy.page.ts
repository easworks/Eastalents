import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarkdownDirective } from '@easworks/app-shell/common/markdown.directive';

@Component({
  standalone: true,
  selector: 'privacy-policy-page',
  templateUrl: './privacy-policy.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [],
  imports: [
    MarkdownDirective
  ]
})
export class PrivacyPolicyPageComponent {
  protected readonly content: string = inject(ActivatedRoute)
    .snapshot.data['content'];

  @HostBinding() private readonly class = ' bg-white';
}
