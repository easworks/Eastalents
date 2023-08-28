import { ChangeDetectionStrategy, Component, HostBinding, inject, signal } from '@angular/core';
import { MessagingApi } from '@easworks/app-shell/api/messaging.api';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { AuthState } from '@easworks/app-shell/state/auth';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { User } from '@easworks/models';

@Component({
  standalone: true,
  selector: 'message-board',
  templateUrl: './message-board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule
  ]
})
export class MessageBoardComponent {
  constructor() {
    this.getUsers();
  }

  @HostBinding() private readonly class = 'block p-2 min-w-[10rem]';

  protected readonly loading$ = generateLoadingState<[
    'users'
  ]>();

  private readonly user$ = inject(AuthState).guaranteedUser();
  private readonly api = inject(MessagingApi);

  protected readonly loadingUsers$ = this.loading$.has('users');
  protected readonly rooms$ = signal<User[]>([]);


  private getUsers() {
    const user = this.user$();
    this.loading$.add('users');
    this.api.getUsers({ role: user.role, _id: user._id })
      .then(result => {
        this.rooms$.set(result);
      })
      .finally(() => this.loading$.delete('users'));
  }
}
