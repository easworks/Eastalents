import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'service-type-schedule-call-section',
  styleUrl: './schedule-call.section.less' ,
  templateUrl: './schedule-call.section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class ServiceTypeScheduleCallSectionComponent {

}