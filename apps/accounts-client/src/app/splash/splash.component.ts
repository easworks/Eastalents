import { Component, HostBinding } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  imports: [
    MatProgressSpinnerModule
  ]
})
export class SplashComponent {
  @HostBinding()
  private readonly class = 'fixed grid h-screen w-screen bg-white place-content-center justify-items-center';
}