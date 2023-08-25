import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'messages-page',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesPageComponent { }
