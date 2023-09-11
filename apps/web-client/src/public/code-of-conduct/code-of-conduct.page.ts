import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarkdownDirective } from '@easworks/app-shell/common/markdown.directive';

@Component({
  standalone: true,
  selector: 'code-of-conduct-page',
  templateUrl: './code-of-conduct.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [],
  imports: [
    MarkdownDirective
  ]
})
export class CodeOfConductPageComponent {
  protected readonly content: string = inject(ActivatedRoute)
    .snapshot.data['content'];

  @HostBinding() private readonly class = 'page py-8';

}