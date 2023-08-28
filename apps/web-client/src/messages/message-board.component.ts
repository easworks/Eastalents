import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { MessagingApi } from '@easworks/app-shell/api/messaging.api';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { AuthState } from '@easworks/app-shell/state/auth';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { SelectableOption } from '@easworks/app-shell/utilities/options';
import { User } from '@easworks/models';
import { MessagesPageComponent } from './messages.page';

@Component({
  standalone: true,
  selector: 'message-board',
  templateUrl: './message-board.component.html',
  styleUrls: ['./message-board.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule
  ]
})
export class MessageBoardComponent {
  constructor() {
    this.getUsers();
    this.reactToRoomSelection();
  }

  protected readonly loading$ = generateLoadingState<[
    'users'
  ]>();

  private readonly user$ = inject(AuthState).guaranteedUser();
  private readonly api = inject(MessagingApi);
  private readonly page = inject(MessagesPageComponent);

  protected readonly loadingUsers$ = this.loading$.has('users');
  protected readonly rooms$ = signal<SelectableOption<User>[]>([]);

  private selectedRoom?: SelectableOption<User>;

  private getUsers() {
    const user = this.user$();
    this.loading$.add('users');
    return this.api.getUsers({ role: user.role, _id: user._id })
      .then(result => {
        const rooms = result.map<SelectableOption<User>>(u => ({
          selected: false,
          value: u
        }));
        this.rooms$.set(rooms);
      })
      .finally(() => this.loading$.delete('users'));
  }

  protected selectRoom(room: SelectableOption<User>) {
    if (this.selectedRoom)
      this.selectedRoom.selected = false;
    room.selected = true;
    this.selectedRoom = room;

    this.page.selectedRoom$.set(this.selectedRoom.value);
  }

  private reactToRoomSelection() {
    effect(() => {
      const parentRoom = this.page.selectedRoom$();
      if (!parentRoom)
        return;
      if (this.selectedRoom?.value._id === parentRoom._id)
        return;

      const toSelect = this.rooms$().find(r => r.value._id === parentRoom._id);
      if (!toSelect)
        throw new Error('invalid operation');

      this.selectRoom(toSelect);
    });
  }
}
