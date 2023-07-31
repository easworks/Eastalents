import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'enterprise-create-job-post',
  templateUrl: './create-job-post.page.html',
  styleUrls: ['./create-job-post.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateJobPostPageComponent { }
