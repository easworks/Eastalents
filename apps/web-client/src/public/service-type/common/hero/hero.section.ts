import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'service-type-hero-section',
  styleUrl: './hero.section.less',
  templateUrl: './hero.section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class ServiceTypeHeroSectionComponent { }