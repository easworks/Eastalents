import { ChangeDetectionStrategy, Component, HostBinding, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { MessageBoardComponent } from './message-board.component';
import { MessageRoomComponent } from './message-room.component';
import { User } from '@easworks/models';

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

  readonly selectedRoom$ = signal<User | null>(null);
}
