import { Directive, OnDestroy } from '@angular/core';
import { from } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Deferred } from './deferred';

@Directive()
export class SubscribedDirective implements OnDestroy {
  private readonly destroyed = new Deferred();
  protected readonly destroyed$ = from(this.destroyed).pipe(shareReplay(1))

  ngOnDestroy(): void {
    this.destroyed.resolve();
  }
}
