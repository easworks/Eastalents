import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DoCheck, ElementRef, HostBinding, HostListener, Input, OnDestroy, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormGroupDirective, NgControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { CanUpdateErrorState, ErrorStateMatcher } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';

@Component({
  selector: 'file-upload',
  standalone: true,
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.less'],
  providers: [
    FormGroupDirective
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
  ]
})
export class FileUploadComponent
  implements
  ControlValueAccessor,
  DoCheck,
  CanUpdateErrorState,
  OnDestroy {

  constructor() {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    this.fm.monitor(this.elRef.nativeElement, true)
      .pipe(takeUntilDestroyed())
      .subscribe(origin => {
        this.focused = !!origin;
        if (this.focused)
          this.elRef.nativeElement.focus();
        this.stateChanges.next();
      });
  }

  private readonly fm = inject(FocusMonitor);
  private readonly _parentFormGroup = inject(FormGroupDirective);
  private readonly elRef = inject<ElementRef<HTMLElement>>(ElementRef);
  public readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly cd = inject(ChangeDetectorRef);

  // @HostBinding('class') class = `block relative p-4
  //         rounded ring-inset ring-1 ring-divider transition-all
  //         [&:not(.disabled)]:hover:ring-primary 
  //         [&:not(.disabled)]:focus:ring-primary 
  //         [&:not(.disabled)]:focus-within:ring-primary
  //         [&:not(.disabled)]:hover:ring-1
  //         [&:not(.disabled)]:focus:ring-2
  //         [&:not(.disabled)]:focus-within:ring-2`;

  @Input()
  get value(): File | File[] | null {
    if (this.files == null || this.files.length === 0) {
      return null;
    }
    else
      if (this.multiple) {
        return this.files;
      }
      else {
        return this.files[0];
      }
  }
  set value(files: File | File[] | null) {
    if (files == null) {
      this.files = [];
    }
    else
      if (files instanceof File) {
        this.files = [files];
      }
      else
        if (this.multiple || files.length === 0) {
          this.files = files;
        }
        else {
          this.files = [files[0]];
        }
    this.stateChanges.next();
  }

  private _placeholder!: string;
  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  get empty() {
    return this.files == null || this.files.length === 0;
  }

  @Input() private _required = false;
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  private _disabled = false;

  @HostBinding('class.disabled')
  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  public files: File[] = [];
  // eslint-disable-next-line @typescript-eslint/ban-types
  protected onChange!: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  protected onTouched!: Function;
  @Input() multiple = false;
  @Input() accept = '';

  protected stateChanges = new Subject<void>();
  protected focused = false;

  @Input() errorStateMatcher: ErrorStateMatcher = new ErrorStateMatcher();
  errorState!: boolean;

  @HostListener('change', ['$event.target']) emitFiles(target: HTMLInputElement) {
    const files = target.files;
    if (files && files.length > 0) {
      if (this.multiple) {
        // because const files does not have iterator
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < files.length; i++) {
          this.files.push(files[i]);
        }
      }
      else {
        this.files = [files[0]];
      }
      this.onChange(this.value);
    }
    target.value = '';
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
    this.onChange(this.value);
    this.cd.detectChanges();
  }

  updateErrorState() {
    const oldState = this.errorState;
    const parent = this._parentFormGroup;
    const matcher = this.errorStateMatcher;
    const control = this.ngControl ? this.ngControl.control : null;
    const newState = matcher.isErrorState(control, parent);

    if (newState !== oldState) {
      this.errorState = newState;
      this.stateChanges.next();
    }
  }
  writeValue(files: File | File[]) {
    this.value = files;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  registerOnTouched(fn: Function) {
    this.onTouched = fn;
  }

  ngDoCheck() {
    this.updateErrorState();
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }
}
