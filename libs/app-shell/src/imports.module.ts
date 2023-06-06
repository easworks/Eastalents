import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LetDirective } from '@ngrx/component';
import { CrossValidationDirective, FormFieldDirective, ReplaceSpinnerComponent, ResubmitIfPendingDirective } from './common';

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
    MatProgressBarModule,
    ReplaceSpinnerComponent
  ]
})
export class ImportsModule { }

export const FormImports = [
  FormsModule,
  ReactiveFormsModule,
  FormFieldDirective,
  CrossValidationDirective,
  ResubmitIfPendingDirective
];