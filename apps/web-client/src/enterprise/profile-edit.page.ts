import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { SelectableOption } from '@easworks/app-shell/utilities/options';
import { BUSINESS_TYPE_OPTIONS, BusinessType, EMPLOYEE_SIZE_OPTIONS, EmployeeSize } from '@easworks/models';

@Component({
  selector: 'enterprise-profile-edit-page',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    LottiePlayerDirective,
    FormImportsModule,
    MatPseudoCheckboxModule
  ]
})
export class EnterpriseProfileEditPageComponent {
  private readonly route = inject(ActivatedRoute);
  @HostBinding() private readonly class = 'flex flex-col lg:flex-row';

  protected readonly trackBy = {
    stringOption: (_: number, s: SelectableOption<string>) => s.value,
  } as const;

  protected readonly displayWith = {
    checkbox: (value: boolean) => value ? 'checked' : 'unchecked'
  } as const;

  protected readonly isNew = this.route.snapshot.queryParamMap.has('new');

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(300)
      ]
    }),
    summary: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(1500)
      ]
    }),
    type: new FormControl(null as unknown as SelectableOption<BusinessType>, {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),
    employeeSize: new FormControl(null as unknown as SelectableOption<EmployeeSize>, {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    })
  });

  protected readonly type = {
    toggle: (option: SelectableOption<BusinessType>) => {
      if (option.selected)
        return;

      const control = this.form.controls.type;
      option.selected = true;
      const old = control.value;
      if (old) {
        old.selected = false;
      }
      control.setValue(option);
    }
  } as const;

  protected readonly employeeSize = {
    toggle: (option: SelectableOption<EmployeeSize>) => {
      if (option.selected)
        return;

      const control = this.form.controls.employeeSize;
      option.selected = true;
      const old = control.value;
      if (old) {
        old.selected = false;
      }
      control.setValue(option);
    }
  } as const;

  protected readonly options = {
    type: BUSINESS_TYPE_OPTIONS.map<SelectableOption<BusinessType>>(t => ({
      selected: false,
      value: t,
      label: t
    })),
    employeeSize: EMPLOYEE_SIZE_OPTIONS.map<SelectableOption<EmployeeSize>>(s => ({
      selected: false,
      value: s,
      label: s
    }))
  } as const;
}
