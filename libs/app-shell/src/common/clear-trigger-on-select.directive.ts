import { DestroyRef, Directive, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Directive({
  standalone: true,
  selector: '[clearTriggerOnSelect][matAutocomplete]'
})
export class ClearTriggerOnSelectDirective implements OnInit {
  private readonly trigger = inject(MatAutocompleteTrigger, { self: true });
  private readonly dRef = inject(DestroyRef);

  ngOnInit() {
    this.trigger.autocomplete.optionSelected
      .pipe(takeUntilDestroyed(this.dRef))
      .subscribe(() => {
        this.trigger.writeValue(undefined);
      });
  }
} 