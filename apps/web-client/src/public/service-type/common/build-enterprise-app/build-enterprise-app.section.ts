import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'service-type-build-enterprise-app-section',
    templateUrl: './build-enterprise-app.section.html',
    styleUrl: './build-enterprise-app.section.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: []
})
export class ServiceTypeBuildEnterpriseAppSectionComponent { }