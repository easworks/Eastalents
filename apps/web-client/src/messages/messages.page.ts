import { ChangeDetectionStrategy, Component, HostBinding, inject, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MessagingApi } from '@easworks/app-shell/api/messaging.api';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { authFeature } from '@easworks/app-shell/state/auth';
import { User } from '@easworks/models';
import { Store } from '@ngrx/store';
import { MessageBoardComponent } from './message-board.component';
import { MessageRoomComponent } from './message-room.component';

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
  readonly api = inject(MessagingApi);
  private readonly store = inject(Store);

  public readonly user$ = this.store.selectSignal(authFeature.guaranteedUser);

  @HostBinding() protected readonly class = '!flex-none';
  protected readonly showBoard$ = signal(true);

  readonly selectedRecipient$ = signal<User | null>(null);
}
