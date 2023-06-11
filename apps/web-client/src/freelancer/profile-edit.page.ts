import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImportsModule, LottiePlayerDirective } from '@easworks/app-shell';

@Component({
  selector: 'freelancer-profile-edit-page',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    LottiePlayerDirective
  ]
})
export class FreelancerProfileEditPageComponent {

  private readonly route = inject(ActivatedRoute);

  @HostBinding() private readonly class = 'flex flex-col lg:flex-row';

  protected readonly isNew = this.route.snapshot.queryParamMap.has('new');
}