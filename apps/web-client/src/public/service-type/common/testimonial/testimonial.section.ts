import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'service-type-testimonial-section',
  styleUrl: './testimonial.section.less' ,
  templateUrl: './testimonial.section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class ServiceTypeTestimonialSectionComponent {

}