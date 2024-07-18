import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'service-type-industries-use-cases-section',
  templateUrl: './industries-use-cases.section.html',
  styleUrl: './industries-use-cases.section.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class ServiceTypeIndustriesUseCasesSectionComponent { } 