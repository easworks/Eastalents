import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { CompanyAddressComponent } from './company-address/company-detail.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';

@Component({
  standalone: true,
  selector: 'employer-general-info',
  templateUrl: './general-info.component.html',
  styleUrl: './general-info.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    CompanyDetailComponent,
    CompanyAddressComponent]
})
export class EmployerGeneralInfoComponent {
  protected readonly activeTab$ = signal<Tab>('details');
}

type Tab = 'details' | 'address';