import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LetDirective } from '@ngrx/component';
import { ReplaceSpinnerComponent } from './replace-spinner/replace-spinner';

export const ImportsModule = [
  CommonModule,
  LetDirective,
  MatDividerModule,
  MatRippleModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  ReplaceSpinnerComponent,
  FontAwesomeModule,
  MatTooltipModule
];

export { ReplaceSpinnerComponent };
