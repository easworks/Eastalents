import { DestroyRef, Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroupDirective } from '@angular/forms';
import { EMPTY, first, switchMap } from 'rxjs';
import { controlStatus$ } from './form-field.directive';

@Directive({
  standalone: true,
  selector: '[resubmitIfPending][formGroup]'
})
export class ResubmitIfPendingDirective implements OnInit {
  private readonly dRef = inject(DestroyRef);
  private readonly fgd = inject(FormGroupDirective);

  ngOnInit() {
    const control = this.fgd.control;
    this.fgd.ngSubmit
      .pipe(
        switchMap(() => {
          if (!control.pending)
            return EMPTY;
          return controlStatus$(control)
            .pipe(first(s => s !== 'PENDING'));
        }),
        takeUntilDestroyed(this.dRef)
      ).subscribe(() => this.fgd.ngSubmit.emit());


  }
}