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
    this.reactToRecipientChange();
  }

  protected readonly loading$ = generateLoadingState<[
    'users'
  ]>();

  private readonly user$ = inject(AuthState).guaranteedUser();
  private readonly api = inject(MessagingApi);
  private readonly page = inject(MessagesPageComponent);

  protected readonly loadingUsers$ = this.loading$.has('users');
  protected readonly recipients$ = signal<SelectableOption<User>[]>([]);

  private selectedRecipient?: SelectableOption<User>;

  private getUsers() {
    const user = this.user$();
    this.loading$.add('users');
    return this.api.getUsers({ role: user.role, _id: user._id })
      .then(result => {
        const recipients = result.map<SelectableOption<User>>(u => ({
          selected: false,
          value: u
        }));
        this.recipients$.set(recipients);
      })
      .finally(() => this.loading$.delete('users'));
  }

  protected selectRecipient(recipient: SelectableOption<User>) {
    if (this.selectedRecipient)
      this.selectedRecipient.selected = false;
    recipient.selected = true;
    this.selectedRecipient = recipient;

    this.page.selectedRoom$.set(this.selectedRecipient.value);
  }

  private reactToRecipientChange() {
    effect(() => {
      const parentRoom = this.page.selectedRoom$();
      if (!parentRoom)
        return;
      if (this.selectedRecipient?.value._id === parentRoom._id)
        return;

      const toSelect = this.recipients$().find(r => r.value._id === parentRoom._id);
      if (!toSelect)
        throw new Error('invalid operation');

      this.selectRecipient(toSelect);
    });
  }
}
