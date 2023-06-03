import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { LetDirective } from '@ngrx/component';

@NgModule({
  imports: [
    LetDirective
  ],
  exports: [
    CommonModule,
    LetDirective,
    MatRippleModule
  ]
})
export class ImportsModule { }

export const FormImports = [
  FormsModule,
  ReactiveFormsModule
];