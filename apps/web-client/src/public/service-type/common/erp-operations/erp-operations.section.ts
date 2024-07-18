import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'service-type-erp-operations-section',
    templateUrl: './erp-operations.section.html',
    styleUrl: './erp-operations.section.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: []
})
export class ServiceTypeErpOperationsSectionComponent { }