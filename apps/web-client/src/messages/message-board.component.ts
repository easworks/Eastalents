import { ChangeDetectionStrategy, Component, inject, isDevMode, signal } from '@angular/core';
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
        if (!this.selectedRecipient) {

          // TODO: remove this code block
          if (isDevMode()) {
            const role = user.role === 'employer' ? 'freelancer' : 'employer';
            const otherParty: SelectableOption<User> = {
              selected: false,
              value: {
                role,
                _id: role === 'employer' ?
                  '646fa97b9f56f3d874be2ae3' :
                  '6481a3caf1e4e196271d0979',
                active: 1,
                email: 'test@test',
                firstName: '[DEV]',
                lastName: role === 'employer' ?
                  'steve cox' : 'ram indalkar',
                verified: true
              }
            };
            recipients.splice(0, 0, otherParty);
            this.selectRecipient(otherParty);
            return;
          }

          this.selectRecipient(recipients[0]);
        }
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
