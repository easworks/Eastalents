import { Component, HostBinding } from '@angular/core';

@Component({
  template: `
  <svg viewBox="0 0 24 24" width="24px" height="24px" focusable="false" aria-hidden="true">
    <path d="M7 10l5 5 5-5z"></path>
  </svg>
  `,
  standalone: true,
  selector: 'drop-down-indicator'
})
export class DropDownIndicatorComponent {
  @HostBinding() class = 'block fill-slate-500/80'
}