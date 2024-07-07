import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogLoaderComponent } from '@easworks/app-shell/common/dialog-loader.component';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { faRemove, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { TechSkill } from '../../models/tech-skill';
import { adminData, techSkillActions } from '../../state/admin-data';

interface AddTechSkillToGroupDialogData {
  skill: TechSkill;
}

@Component({
  standalone: true,
  selector: 'tech-skill-groups-dialog',
  templateUrl: './tech-skill-groups.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    MatDialogModule,
    MatCheckboxModule
  ]
})
export class TechSkillGroupsDialogComponent implements OnInit {
  private readonly data = inject<AddTechSkillToGroupDialogData>(MAT_DIALOG_DATA);
  private readonly store = inject(Store);

  protected readonly icons = {
    faXmark,
    faRemove
  } as const;


  protected readonly table = (() => {

    const changes = generateLoadingState<string[]>();

    const original = this.data.skill.groups.reduce((state, [id, generic]) => {
      state[id] = generic;
      return state;
    }, {} as Record<string, boolean>);

    const rows$ = signal<{
      id: string;
      name: string;
      generic: boolean;
    }[]>([]);

    const empty$ = computed(() => rows$().length === 0);

    const remove = (id: string) => {
      rows$.update(rows => rows.filter(r => r.id !== id));
      if (id in original)
        changes.add(id);
      else
        changes.delete(id);
    };

    const updateGeneric = (id: string, value: boolean) => {
      rows$.update(rows => {
        const skill = rows.find(r => r.id === id);
        if (!skill) throw new Error('invalid operation');
        skill.generic = value;
        return rows;
      });
      if (id in original) {
        if (original[id] === value)
          changes.delete(id);
        else
          changes.add(id);
      }

    };

    return {
      rows$,
      empty$,
      changes,
      updateGeneric,
      remove
    } as const;
  })();

  protected readonly buttons = (() => {
    const save = (() => {
      const disabled$ = computed(() => !this.table.changes.any$());

      const click = () => {
        const value: TechSkill['groups'] = this.table.rows$()
          .map(row => [row.id, row.generic]);

        this.store.dispatch(techSkillActions.updateGroups({
          payload: {
            id: this.data.skill.id,
            groups: value
          }
        }));
      };

      return {
        disabled$,
        click
      } as const;

    })();

    const reset = (() => {
      const groups = this.store.selectSignal(adminData.selectors.techGroup.selectEntities)();

      const click = () => {
        const value = this.data.skill.groups.map(([id, generic]) => ({
          id,
          generic,
          name: groups[id]?.name || ''
        }));

        this.table.rows$.set(value);
        this.table.changes.clear();
      };

      return { click } as const;
    })();

    return { save, reset } as const;
  })();

  public static open(ref: MatDialogRef<DialogLoaderComponent>, data: AddTechSkillToGroupDialogData) {
    DialogLoaderComponent.replace(ref, this, data);
  }

  ngOnInit() {
    this.buttons.reset.click();
  }
}