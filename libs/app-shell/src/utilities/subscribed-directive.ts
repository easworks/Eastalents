import { DestroyRef, Directive, inject } from '@angular/core';

@Directive({
  standalone: true
})
export class SubscribedDirective {

  private readonly dRef = inject(DestroyRef);
  readonly destroyed = new Promise<void>(resolve => {
    this.dRef.onDestroy(() => resolve())
  })
}
