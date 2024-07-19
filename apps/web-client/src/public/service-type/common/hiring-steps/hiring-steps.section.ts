import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'service-type-hiring-steps-section',
  templateUrl: './hiring-steps.section.html',
  styleUrl: './hiring-steps.section.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class ServiceTypeHiringStepsSectionComponent { } 