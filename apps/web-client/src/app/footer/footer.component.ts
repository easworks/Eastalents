import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { footerNav, publicMenu } from '../menu-items/public';

@Component({
  standalone: true,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    FontAwesomeModule
  ]
})
export class AppFooterComponent {
  protected readonly icons = {
    faAngleRight
  } as const;

  protected readonly footerNav = footerNav;

  protected readonly social = publicMenu.social;

}