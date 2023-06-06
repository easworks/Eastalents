import { DestroyRef, Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroupDirective } from '@angular/forms';
import { Subscription, first } from 'rxjs';

@Directive({
  standalone: true,
  selector: 'form[formGroup][resubmitIfPending]'
})
export class ResubmitIfPendingDirective implements OnInit {
  private readonly dRef = inject(DestroyRef);
  private readonly fgd = inject(FormGroupDirective)

  private resubmissionSub?: Subscription;

  ngOnInit() {
    this.fgd.ngSubmit
      .pipe(takeUntilDestroyed(this.dRef))
      .subscribe(() => {
        this.resubmissionSub?.unsubscribe();
        if (this.fgd.control.pending) {
          this.resubmissionSub = this.fgd.control.statusChanges
            .pipe(
              takeUntilDestroyed(this.dRef),
              first(s => s !== 'PENDING'))
            .subscribe(() => this.fgd.ngSubmit.emit());
        }
      })
  }
}