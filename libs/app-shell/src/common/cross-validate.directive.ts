import { DestroyRef, Directive, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControlDirective, FormGroupDirective } from '@angular/forms';
import { startWith } from 'rxjs';

@Directive({
  standalone: true,
  selector: '[formControl][crossValidate],[formGroup][crossValidate]'
})
export class CrossValidationDirective implements OnInit {
  private readonly dRef = inject(DestroyRef);

  private readonly controlDirective = (() => {
    let dir;
    dir = inject(FormControlDirective, { self: true, optional: true });
    dir ||= inject(FormGroupDirective, { self: true });
    return dir;
  })();

  @Input() crossValidate: string[] = [];

  private get parent() {
    const p = this.controlDirective.control.parent;
    if (!p)
      throw new Error('form control was expected to have to a parent control');
    return p;
  }

  private get control() {
    return this.controlDirective.control;
  }
  private get cvErrors(): string[] {
    return this.crossValidate.filter(cv => this.parent.hasError(cv));
  }

  private init() {
    this.parent.valueChanges
      // run this logic once during initialisation as well
      .pipe(
        startWith([this.parent.value]),
        takeUntilDestroyed(this.dRef),
      )
      .subscribe(() => {
        if (!this.control.enabled)
          return;

        if (this.parent.valid) {
          if (!this.control.valid) {
            this.control.updateValueAndValidity();
          }
        }
        else {
          this.propagateErrors();
        }

      });
  }

  private propagateErrors(): void {
    const a = this.cvErrors;
    if (a.length > 0) {
      const existingErrors = this.control.errors ?? {};
      a.forEach(e => {
        existingErrors[e] = this.parent.errors?.[e];
      });
      this.control.setErrors(existingErrors);
    }
    else if (!this.control.valid) {
      if (Object.keys(this.control.errors ?? {}).some(key => this.crossValidate.includes(key))) {
        this.control.updateValueAndValidity();
      }
    }
  }

  ngOnInit(): void {
    this.init();
  }
}