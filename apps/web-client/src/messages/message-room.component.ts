import { ChangeDetectionStrategy, Component, HostBinding, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';

@Component({
  standalone: true,
  selector: 'message-room',
  templateUrl: './message-room.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    MatSidenavModule
  ]
})
export class MessageRoomComponent {
  @HostBinding() protected readonly class = 'block';
  protected readonly showInfoPanel$ = signal(true);
}