import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'message-board',
  templateUrl: './message-board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class MessageBoardComponent { }