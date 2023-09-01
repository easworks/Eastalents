import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, INJECTOR, computed, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, Validators } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { controlStatus$ } from '@easworks/app-shell/common/form-field.directive';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { ErrorSnackbarDefaults, SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { sleep } from '@easworks/app-shell/utilities/sleep';
import { Message, MessageRoom } from '@easworks/models';
import { faComments, faPlay, faPaperclip, faFile, faXmark } from '@fortawesome/free-solid-svg-icons';
import { repeat, switchMap, timer } from 'rxjs';
import { MessagesPageComponent } from './messages.page';
import { FileUploadComponent } from '@easworks/app-shell/common/file-upload/file-upload.component';

const MB_5 = 5 * 1024 * 1024;

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
    FormImportsModule,
    FileUploadComponent
  ]
})
export class MessageRoomComponent {
  constructor() {
    this.pollForMessages();
    this.reactToRecipientChange();
  }

  private readonly injector = inject(INJECTOR);
  private readonly page = inject(MessagesPageComponent);
  private readonly snackbar = inject(MatSnackBar);
  private readonly el = inject(ElementRef, { self: true }).nativeElement as HTMLElement;

  get messagesContainer() {
    const container = this.el.querySelector('.messages-container');
    if (!container)
      throw new Error('invalid operation');
    return container;
  }

  @HostBinding() protected readonly class = 'block';
  protected readonly icons = {
    faComments,
    faPlay,
    faPaperclip,
    faXmark
  } as const;

  protected readonly trackBy = {
    message: (_: number, item: { data: Message; }) => item.data._id
  } as const;

  protected readonly showInfoPanel$ = signal(false);
  private readonly loading = generateLoadingState<[
    'getting room',
    'sending message'
  ]>();

  protected readonly room$ = signal<MessageRoom | null>(null);
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
          const messages = await this.page.api.requests
            .getRoomMessages({ chatRoomId: room._id });

          this.room$.set(room);
          this.messages.data$.set(messages);
        }
        finally {
          this.loading.delete('getting room');
          this.scrollMessagesToBottom();
        }
      }
    }, { allowSignalWrites: true });
  }

  private initMessageControls() {
    const text = this.initTextMessage();

    const files = this.initFileMessage();

    const mode$ = computed(() => files.$() ? 'file' : 'text');
    const sending$ = this.loading.has('sending message');
    const cannotSend$ = computed(() => {
      if (sending$()) return true;
      switch (mode$()) {
        case 'file': return files.cannotSend$();
        case 'text': return text.cannotSend$();
      }
    });

    const send = () => {
      switch (mode$()) {
        case 'file': return files.send();
        case 'text': return text.send();
      }
    };

    const data$ = signal<Message[]>([]);
    const list$ = computed(() => {
      const data = data$();
      const user = untracked(this.page.user$);

      return data.map(m => ({
        self: m.user._id === user._id,
        data: m
      }));
    });

    return {
      mode$,
      sending$, cannotSend$,
      data$, list$,
      text,
      files,
      send
    } as const;

  }

  private initTextMessage() {
    const form = new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    });

    const status$ = toSignal(controlStatus$(form));
    const cannotSend$ = computed(() => status$() !== 'VALID');

    effect(() => {
      this.room$();
      form.patchValue('');
    }, { allowSignalWrites: true });

    const send = () => {
      const room = this.room$();
      const user = this.page.user$();
      if (!room)
        throw new Error('invalid opertaion');

      const { form } = this.messages.text;
      if (!form.valid)
        return;

      this.loading.add('sending message');

      const content = form.value;
      this.page.api.requests.sendTextMessage({
        chatRoomId: room._id,
        message: content,
        userId: user._id
      }).catch((e) => {
        this.snackbar.openFromComponent(SnackbarComponent, {
          ...ErrorSnackbarDefaults,
          data: { message: e.message }
        });
        this.loading.delete('sending message');
      });
    };

    return {
      form,
      cannotSend$,
      send
    } as const;
  }

  private initFileMessage() {
    const file$ = signal<File | null>(null);

    const $ = computed(() => {
      const file = file$();
      if (file) {
        let error;
        if (file.size > MB_5) {
          error = 'must be less than 5 MB';
        }

        return {
          file,
          icon: faFile,
          error
        };
      }

      return null;
    });

    const cannotSend$ = computed(() => {
      const f = $();
      return !f || !!f.error;
    });

    const update = (input: HTMLInputElement) => {
      if (input.files?.length) {
        file$.set(input.files[0]);
      }
    };

    const remove = () => file$.set(null);

    const send = async () => {
      const file = $();
      if (!file)
        throw new Error('invalid operation');

      const room = this.room$();
      if (!room)
        throw new Error('invalid operation');

      this.loading.add('sending message');
      this.page.api.requests.sendFileMessage({
        chatRoomId: room._id,
        userId: this.page.user$()._id,
        fileName: file.file.name,
        fileData: await file.file.arrayBuffer()
      }).catch((e) => {
        this.snackbar.openFromComponent(SnackbarComponent, {
          ...ErrorSnackbarDefaults,
          data: { message: e.message }
        });
        this.loading.delete('sending message');
      });;
    };

    return {
      $,
      cannotSend$,
      update, remove, send
    } as const;
  }

  private pollForMessages() {
    // return;
    timer(1000)
      .pipe(
        switchMap(async () => {
          const room = this.room$();
          if (!room)
            return;

          const messages = await this.page.api.requests
            .getRoomMessages({ chatRoomId: room._id });

          // verify that the room did not change while fetching the messages
          if (room._id !== this.room$()?._id)
            return;

          const oldCount = this.messages.data$().length;
          const newCount = messages.length;
          const hasNewMessages = newCount && newCount > oldCount;

          if (hasNewMessages) {
            const { scrollHeight, scrollTop, clientHeight } = this.messagesContainer;
            const wasAtBottom = scrollHeight === (scrollTop + clientHeight);

            this.messages.data$.set(messages);

            const lastSentBySelf = messages.at(-1)?.user._id === this.page.user$()._id;

            if (lastSentBySelf) {
              this.scrollMessagesToBottom();

              if (this.loading.set$().has('sending message')) {
                this.messages.text.form.reset('');
                this.loading.delete('sending message');
              }
            }
            else {
              if (wasAtBottom)
                this.scrollMessagesToBottom();
            }
          }
        }),
        repeat(),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  private async scrollMessagesToBottom() {
    await sleep();
    this.messagesContainer.scrollTo({
      top: this.messagesContainer.scrollHeight
    });
  }
}