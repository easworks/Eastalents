import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogLoaderComponent } from '@easworks/app-shell/common/dialog-loader.component';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { sortString } from '@easworks/app-shell/utilities/sort';
import { faRemove, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import Fuse from 'fuse.js';
import { TechGroup, TechSkill } from '../../models/tech-skill';
import { adminData, techSkillActions } from '../../state/admin-data';

interface TechSkillGroupsDialogData {
  skill: string;
}

@Component({
  standalone: true,
  selector: 'tech-skill-groups-dialog',
  templateUrl: './tech-skill-groups.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule,
    MatDialogModule,
    MatCheckboxModule,
    MatAutocompleteModule
  ]
})
export class TechSkillGroupsDialogComponent implements OnInit {
  private readonly data = inject<TechSkillGroupsDialogData>(MAT_DIALOG_DATA);
  private readonly store = inject(Store);
  private readonly cdRef = inject(ChangeDetectorRef);

  protected readonly icons = {
    faXmark,
    faRemove
  } as const;

  protected readonly skill$ = (() => {
    const map$ = this.store.selectSignal(adminData.selectors.techSkill.selectEntities);

    return computed(() => {
      const skill = map$()[this.data.skill];
      if (!skill)
        throw new Error('invalid operation');
      return skill;
    });
  })();


  private readonly groups = (() => {
    const map$ = this.store.selectSignal(adminData.selectors.techGroup.selectEntities);
    const list$ = this.store.selectSignal(adminData.selectors.techGroup.selectAll);

    return {
      map$,
      list$
    } as const;
  })();


  protected readonly table = (() => {

    const changes = generateLoadingState<string[]>();

    const original$ = computed(() => new Set(this.skill$().groups));

    const rows$ = signal<{
      id: string;
      name: string;
    }[]>([]);

    const empty$ = computed(() => rows$().length === 0);

    const remove = (id: string) => {
      const original = original$();
      rows$.update(rows => rows.filter(r => r.id !== id));
      if (original.has(id))
        changes.add(id);
      else
        changes.delete(id);
    };

    const add = (() => {
      const query$ = signal('' as TechGroup | string);
      const displayWith = (v: TechGroup | string | null) => typeof v === 'string' ? v : v?.name || '';

      const searchable$ = computed(() => {
        const rows = rows$();
        const list = this.groups.list$();

        const added = new Set(rows.map(r => r.id));
        return list.filter(s => !added.has(s.id));
      });

      const search$ = computed(() => new Fuse(searchable$(), {
        keys: ['name'],
        includeScore: true,
      }));

      const results$ = computed(() => {
        let q = query$();

        if (typeof q === 'string') {
          q = q.trim();

          if (q)
            return search$()
              .search(q)
              .map(r => r.item);
        }

        return searchable$();
      });

      const onSelect = (event: MatAutocompleteSelectedEvent) => {
        const original = original$();
        const value = event.option.value as TechGroup;

        rows$.update(v => {
          v.push({
            id: value.id,
            name: value.name
          });

          v.sort((a, b) => sortString(a.id, b.id));

          return [...v];
        });
        if (original.has(value.id))
          changes.delete(value.id);
        else
          changes.add(value.id);
        this.cdRef.detectChanges();
        query$.set('');
      };


      return {
        query$,
        displayWith,
        results$,
        onSelect
      } as const;
    })();

    return {
      rows$,
      empty$,
      changes,
      add,
      remove
    } as const;
  })();

  protected readonly buttons = (() => {
    const save = (() => {
      const disabled$ = computed(() => !this.table.changes.any$());

      const click = () => {
        const value: TechSkill['groups'] = this.table.rows$()
          .map(row => row.id);

        this.store.dispatch(techSkillActions.updateGroups({
          payload: {
            id: this.data.skill,
            groups: value
          }
        }));

        this.table.changes.clear();
      };

      return {
        disabled$,
        click
      } as const;

    })();

    const reset = (() => {

      const click = () => {
        const groups = this.groups.map$();
        const skill = this.skill$();
        const value = skill.groups.map(id => ({
          id,
          name: groups[id]?.name || ''
        }));

        this.table.rows$.set(value);
        this.table.changes.clear();
        this.table.add.query$.set('');
      };

      return { click } as const;
    })();

    return { save, reset } as const;
  })();

  public static open(ref: MatDialogRef<DialogLoaderComponent>, data: TechSkillGroupsDialogData) {
    DialogLoaderComponent.replace(ref, this, data);
    ref.addPanelClass('w-80');
  }

  ngOnInit() {
    this.buttons.reset.click();
  }
}