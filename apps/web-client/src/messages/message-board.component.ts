import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
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
  }

  protected readonly loading = generateLoadingState<[
    'users'
  ]>();

  private readonly page = inject(MessagesPageComponent);

  protected readonly loadingUsers$ = this.loading.has('users');
  protected readonly recipients$ = signal<SelectableOption<User>[]>([]);

  private selectedRecipient?: SelectableOption<User>;

  private getUsers() {
    const user = this.page.user$();
    this.loading.add('users');
    this.page.api.requests.getUsers({ role: user.role, _id: user._id })
      .then(users => {
        const recipients = users.map<SelectableOption<User>>(u => ({
          selected: false,
          value: u
        }));
        this.recipients$.set(recipients);
      })
      .finally(() => this.loading.delete('users'));

  }

  protected selectRecipient(recipient: SelectableOption<User>) {
    if (this.selectedRecipient)
      this.selectedRecipient.selected = false;
    recipient.selected = true;
    this.selectedRecipient = recipient;

    this.page.selectedRecipient$.set(this.selectedRecipient.value);
  }
}
