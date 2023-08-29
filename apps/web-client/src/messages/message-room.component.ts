import { ChangeDetectionStrategy, Component, HostBinding, effect, inject, signal, untracked } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { MessagesPageComponent } from './messages.page';
import { MessageRoom } from '@easworks/models';
import { faComments, faPlay } from '@fortawesome/free-solid-svg-icons';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  standalone: true,
  selector: 'message-room',
  templateUrl: './message-room.component.html',
  styleUrls: ['./message-room.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    MatSidenavModule,
    TextFieldModule
  ]
})
export class MessageRoomComponent {
  constructor() {
    this.reactToRecipientChange();
  }

  private readonly page = inject(MessagesPageComponent);

  @HostBinding() protected readonly class = 'block';
  protected readonly icons = {
    faComments,
    faPlay
  } as const;
  protected readonly showInfoPanel$ = signal(true);
  private readonly loading = generateLoadingState<[
    'getting room'
  ]>();

  protected readonly room$ = signal<MessageRoom | null>(null);
  protected readonly messages$ = signal<any[]>([]);
  protected readonly loadingRoom$ = this.loading.has('getting room');

  private reactToRecipientChange() {
    effect(async () => {
      const recipient = this.page.selectedRecipient$();
      if (recipient) {
        this.loading.add('getting room');
        const user = untracked(this.page.user$);

        try {
          const room = await this.page.api.requests.getRoom({
            fromUserId: user._id,
            toUserId: recipient._id,
          });
          const messages = await this.page.api.requests.getRoomMessages({ chatRoomId: room._id });

          this.room$.set(room);
          this.messages$.set(messages);
        }
        finally {
          this.loading.delete('getting room');
        }
      }
    }, { allowSignalWrites: true });
  }
}