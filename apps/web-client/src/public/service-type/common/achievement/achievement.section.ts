import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'service-type-achievement-section',
    templateUrl: './achievement.section.html',
    styleUrl: './achievement.section.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: []
})
export class ServiceTypeAchievementSectionComponent { }