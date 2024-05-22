import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { adminData } from '../state/admin-data';

@Component({
  standalone: true,
  selector: 'tech-groups-page',
  templateUrl: './tech-groups.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule
  ]
})
export class TechGroupsPageComponent {
  private readonly store = inject(Store);
  private readonly dRef = inject(DestroyRef);

  protected readonly maxlength = { name: 64 } as const;

  private readonly loading = generateLoadingState<[
    'updating tech group',
    'adding tech group',
    'opening create-tech-group dialog'
  ]>();
  private readonly groups$ = this.store.selectSignal(adminData.selectors.techGroup.selectAll);

  protected readonly accordion = (() => {
    const panelControls = () => {
      return {
        name: new FormControl('', {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.maxLength(this.maxlength.name)
          ]
        })
      };
    };

    const panels = (() => {
      const updating = generateLoadingState<string[]>();
      this.loading.react('updating tech group', updating.any$);

      let rowSubs = new Subscription();
      this.dRef.onDestroy(() => rowSubs.unsubscribe());

      const $ = computed(() => {
        rowSubs.unsubscribe();
        rowSubs = new Subscription();

        return this.groups$();
      });

      return { $ } as const;
    })();

    return {
      panels
    } as const;

  })();

}