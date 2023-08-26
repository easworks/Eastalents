import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'message-room',
  templateUrl: './message-room.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class MessageRoomComponent { }