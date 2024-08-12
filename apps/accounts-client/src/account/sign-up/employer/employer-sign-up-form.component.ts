import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'employer-sign-up-form',
  templateUrl: './employer-sign-up-form.component.html',
  styleUrl: './employer-sign-up-form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class EmployerSignUpFormComponent {
}