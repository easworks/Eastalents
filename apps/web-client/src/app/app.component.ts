import { Component, HostBinding } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'easworks-web-client-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  imports: [
    RouterModule,
    MatSidenavModule,
    MatRippleModule
  ]
})
export class AppComponent {
  @HostBinding()
  private readonly class = 'flex flex-col min-h-screen';
}
