import { ChangeDetectionStrategy, Component, HostBinding, signal } from '@angular/core';
import { MessageBoardComponent } from './message-board.component';
import { MessageRoomComponent } from './message-room.component';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  standalone: true,
  selector: 'messages-page',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MessageBoardComponent,
    MessageRoomComponent,
    ImportsModule,
    MatSidenavModule
  ]
})
export class MessagesPageComponent {
  @HostBinding() protected readonly class = 'flex';
  protected readonly showBoard$ = signal(true);
}
