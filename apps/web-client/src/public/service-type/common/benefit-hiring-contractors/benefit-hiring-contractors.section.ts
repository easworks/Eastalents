import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'service-type-benefit-hiring-contractors-section',
    templateUrl: './benefit-hiring-contractors.section.html',
    styleUrl: './benefit-hiring-contractors.section.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: []
})
export class ServiceTypeBenefitHiringContractorsSectionComponent { }