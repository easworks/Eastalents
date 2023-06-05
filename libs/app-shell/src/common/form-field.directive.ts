import { ChangeDetectorRef, DestroyRef, Directive, HostBinding, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';

@Directive({
  standalone: true,
  selector: '[formFieldControl]',
})
export class FormFieldDirective implements OnInit {
  private readonly dRef = inject(DestroyRef);
  private readonly cdRef = inject(ChangeDetectorRef);

  @Input({ required: true, alias: 'formFieldControl' }) public control!: FormControl;

  @HostBinding() private get class() {
    return [
      'form-field',
      this.control.invalid ? 'invalid' : undefined,
      this.control.dirty ? 'dirty' : undefined
    ];
  }

  ngOnInit(): void {
    this.control.statusChanges
      .pipe(takeUntilDestroyed(this.dRef))
      .subscribe(() => {
        this.cdRef.markForCheck()
      })
  }

}