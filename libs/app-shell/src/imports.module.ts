import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LetDirective } from '@ngrx/component';
import { CrossValidationDirective, FormFieldDirective, ReplaceSpinnerComponent } from './common';

@NgModule({
  imports: [
    LetDirective,
    ReplaceSpinnerComponent
  ],
  exports: [
    CommonModule,
    LetDirective,
    MatDividerModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    ReplaceSpinnerComponent
  ]
})
export class ImportsModule { }

export const FormImports = [
  FormsModule,
  ReactiveFormsModule,
  FormFieldDirective,
  CrossValidationDirective
];