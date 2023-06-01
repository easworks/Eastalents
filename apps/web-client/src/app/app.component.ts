import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { AppFooterComponent } from './footer.component';

@Component({
  standalone: true,
  selector: 'easworks-web-client-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatSidenavModule,
    MatRippleModule,
    MatDividerModule,

    AppFooterComponent
  ]
})
export class AppComponent {
  @HostBinding()
  private readonly class = 'flex flex-col min-h-screen';
}
