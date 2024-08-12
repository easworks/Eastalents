import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'talent-sign-up-form',
  templateUrl: './talent-sign-up-form.component.html',
  styleUrl: './talent-sign-up-form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule
  ]
})
export class TalentSignUpFormComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly query$ = toSignal(this.route.queryParams, { requireSync: true });
  protected readonly socialPrefill$ = toSignal(this.route.data.pipe(map(d => d['socialPrefill'])), { requireSync: true });
}