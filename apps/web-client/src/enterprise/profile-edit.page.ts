import { ChangeDetectionStrategy, Component, HostBinding, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { IndustryGroup } from '@easworks/app-shell/api/talent.api';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { DomainState } from '@easworks/app-shell/state/domains';
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
    MatPseudoCheckboxModule,
    MatAutocompleteModule
  ]
})
export class EnterpriseProfileEditPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly domains = inject(DomainState);
  @HostBinding() private readonly class = 'flex flex-col lg:flex-row';

  protected readonly trackBy = {
    name: (_: number, i: { name: string }) => i.name,
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
    }),
    industry: new FormGroup({
      group: new FormControl(null as unknown as IndustryGroup, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      })
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

  protected readonly industry = this.initIndustry();

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

  private initIndustry() {
    this.domains.getIndustries()

    const query$ = signal<string>('');

    const filteredOptions$ = computed(() => {
      const q = query$();
      const all = this.domains.industries$();

      const filter = q && q.trim().toLowerCase();

      if (filter) {
        const filtered = all
          .map<IndustryGroup>(g => {
            const matchGroup = g.name.toLowerCase().includes(filter);
            if (matchGroup) {
              return g;
            }
            return {
              name: g.name,
              industries: g.industries.filter(i => i.toLowerCase().includes(filter)),
            }
          })
          .filter(ig => ig.industries.length);
        return filtered;
      }

      return all;
    });

    const select = (group: IndustryGroup, name: string) => {
      this.form.controls.industry.setValue({ group, name });
    }

    const clear = () => {
      this.form.controls.industry.setValue({
        group: null as unknown as IndustryGroup,
        name: ''
      })
    }

    const loading$ = this.domains.loading.has('industries');
    return {
      query$,
      filteredOptions$,
      select,
      clear,
      loading$
    }
  }
}
