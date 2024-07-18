import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'service-type-hand-picking-section',
    templateUrl: './hand-picking.section.html',
    styleUrl: './hand-picking.section.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: []
})
export class ServiceTypeHandPickingSectionComponent { }