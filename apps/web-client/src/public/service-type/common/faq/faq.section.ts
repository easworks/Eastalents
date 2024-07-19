import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'service-type-faq-section',
    templateUrl: './faq.section.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: []
})
export class ServiceTypeFaqSectionComponent { }