import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, HostBinding, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, Validators } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { controlStatus$ } from '@easworks/app-shell/common/form-field.directive';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { MessageRoom } from '@easworks/models';
import { faComments, faPlay } from '@fortawesome/free-solid-svg-icons';
import { MessagesPageComponent } from './messages.page';

@Component({
  standalone: true,
  selector: 'message-room',
  templateUrl: './message-room.component.html',
  styleUrls: ['./message-room.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    MatSidenavModule,
    TextFieldModule,
    FormImportsModule
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

  protected readonly messages = this.initMessageControls();

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

  private initMessageControls() {
    const text = this.initTextMessage();

    return { text } as const;

  }

  private initTextMessage() {
    const form = new FormControl('', {
      validators: [Validators.required]
    });

    const status$ = toSignal(controlStatus$(form));
    const canSend$ = computed(() => status$() === 'VALID');

    effect(() => {
      this.room$();
      form.patchValue('');
    }, { allowSignalWrites: true });

    return { form, canSend$ } as const;
  }

  protected sendTextMessage() {
    const { form } = this.messages.text;
    if (!form.valid)
      return;

    const content = form.value;
    console.debug(content);
  }
}