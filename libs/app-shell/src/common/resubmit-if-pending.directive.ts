import { DestroyRef, Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroupDirective } from '@angular/forms';
import { Subscription, first } from 'rxjs';
import { statusChangesWithCurrent } from './form-field.directive';

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
          this.resubmissionSub = statusChangesWithCurrent(this.fgd.control)
            .pipe(
              first(s => s !== 'PENDING'),
              takeUntilDestroyed(this.dRef))
            .subscribe(() => this.fgd.ngSubmit.emit());
        }
      })
  }
}