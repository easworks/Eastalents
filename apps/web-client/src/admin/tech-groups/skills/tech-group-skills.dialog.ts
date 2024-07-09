import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ClearTriggerOnSelectDirective } from '@easworks/app-shell/common/clear-trigger-on-select.directive';
import { DialogLoaderComponent } from '@easworks/app-shell/common/dialog-loader.component';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { sortString } from '@easworks/app-shell/utilities/sort';
import { faSquareXmark, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import Fuse from 'fuse.js';
import { TechGroup } from '../../models/tech-skill';
import { adminData, techGroupActions } from '../../state/admin-data';

interface TechGroupSkillsDialogData {
  group: string;
}

@Component({
  standalone: true,
  selector: 'tech-group-skills-dialog',
  templateUrl: './tech-group-skills.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    MatDialogModule,
    FormImportsModule,
    MatAutocompleteModule,
    ClearTriggerOnSelectDirective
  ]
})
export class TechGroupSkillsDialogComponent implements OnInit {
  private readonly data = inject<TechGroupSkillsDialogData>(MAT_DIALOG_DATA);
  private readonly store = inject(Store);

  protected readonly icons = {
    faXmark,
    faSquareXmark
  } as const;

  protected readonly group$ = (() => {
    const map$ = this.store.selectSignal(adminData.selectors.techGroup.selectEntities);

    return computed(() => {
      const group = map$()[this.data.group];
      if (!group)
        throw new Error('invalid operation');
      return group;
    });
  })();

  private readonly skills = (() => {
    const map$ = this.store.selectSignal(adminData.selectors.techSkill.selectEntities);
    const list$ = this.store.selectSignal(adminData.selectors.techSkill.selectAll);

    return {
      map$,
      list$
    } as const;
  })();

  protected readonly skillContainer = (() => {

    const changes = generateLoadingState<string[]>();
    const original$ = computed(() => new Set(this.group$().skills));

    const chips$ = signal<{
      id: string;
      name: string;
    }[]>([]);

    const empty$ = computed(() => chips$().length === 0);

    const remove = (id: string) => {
      const original = original$();
      chips$.update(chips => chips.filter(chip => chip.id !== id));
      if (original.has(id))
        changes.add(id);
      else
        changes.delete(id);
    };

    const add = (() => {
      const query$ = signal('' as TechGroup | string);
      const displayWith = (v: TechGroup | string | null) => typeof v === 'string' ? v : v?.name || '';

      const searchable$ = computed(() => {
        const chips = chips$();
        const list = this.skills.list$();

        const added = new Set(chips.map(c => c.id));
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

        chips$.update(v => {
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
      };


      return {
        query$,
        displayWith,
        results$,
        onSelect
      } as const;
    })();

    return {
      chips$,
      empty$,
      changes,
      add,
      remove
    } as const;
  })();

  protected readonly buttons = (() => {
    const save = (() => {
      const disabled$ = computed(() => !this.skillContainer.changes.any$());

      const click = () => {
        const value: TechGroup['skills'] = this.skillContainer.chips$()
          .map(chip => chip.id);

        this.store.dispatch(techGroupActions.updateSkills({
          payload: {
            id: this.data.group,
            skills: value
          }
        }));

        this.skillContainer.changes.clear();
      };

      return {
        disabled$,
        click
      } as const;

    })();

    const reset = (() => {
      const click = () => {
        const skills = this.skills.map$();
        const group = this.group$();

        const value = group.skills.map(id => ({
          id,
          name: skills[id]?.name || ''
        }));

        this.skillContainer.chips$.set(value);
        this.skillContainer.changes.clear();
        this.skillContainer.add.query$.set('');
      };

      return { click } as const;

    })();

    return { save, reset } as const;
  })();

  public static open(ref: MatDialogRef<DialogLoaderComponent>, data: TechGroupSkillsDialogData) {
    DialogLoaderComponent.replace(ref, this, data);
    ref.addPanelClass('w-full');
  }

  ngOnInit() {
    this.buttons.reset.click();
  }
}