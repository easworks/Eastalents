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
import { TechGroup, TechSkill } from '../../models/tech-skill';
import { adminData, softwareProductActions } from '../../state/admin-data';

interface SoftwareProductSkillsDialogData {
  product: string;
}

@Component({
  standalone: true,
  selector: 'software-product-skills-dialog',
  templateUrl: './software-product-skills.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    MatDialogModule,
    FormImportsModule,
    MatAutocompleteModule,
    ClearTriggerOnSelectDirective
  ]
})
export class SoftwareProductSkillsDialogComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly data = inject<SoftwareProductSkillsDialogData>(MAT_DIALOG_DATA);

  protected readonly icons = {
    faXmark,
    faSquareXmark
  } as const;

  protected readonly product$ = (() => {
    const map$ = this.store.selectSignal(adminData.selectors.softwareProduct.selectEntities);

    return computed(() => {
      const product = map$()[this.data.product];
      if (!product)
        throw new Error('invalid operation');
      return product;
    });
  })();

  private readonly groups = (() => {
    const map$ = this.store.selectSignal(adminData.selectors.techGroup.selectEntities);
    const list$ = this.store.selectSignal(adminData.selectors.techGroup.selectAll);

    return { map$, list$ };
  })();


  private readonly skills = (() => {
    const map$ = this.store.selectSignal(adminData.selectors.techSkill.selectEntities);
    const list$ = this.store.selectSignal(adminData.selectors.techSkill.selectAll);

    return { map$, list$ };
  })();

  protected readonly table = (() => {

    const changes = generateLoadingState<string[]>();

    const original$ = computed(() => {
      return Object.fromEntries(
        Object.entries(this.product$().skills)
          .map(([groupId, skills]) => [groupId, new Set(skills)])
      );
    });

    const value$ = signal<Record<string, string[]>>({});

    const cards = (() => {

      const $ = computed(() => {

        const value = value$();

        const maps = {
          groups: this.groups.map$(),
          skills: this.skills.map$()
        } as const;


        return Object.keys(value)
          .map(id => {
            const group = maps.groups[id];
            if (!group)
              throw new Error('');

            const skills = value[id].map(id => {
              const skill = maps.skills[id];
              if (!skill)
                throw new Error('');
              return skill;
            });
            const empty = skills.length === 0;

            const add = (() => {
              const query$ = signal('' as TechSkill | string);
              const displayWith = (v: TechSkill | string | null) => typeof v === 'string' ? v : v?.name || '';

              const searchable$ = computed(() => {
                const list = this.skills.list$();

                const added = new Set(skills.map(s => s.id));
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
                const value = event.option.value as TechSkill;

                value$.update(v => {
                  v[group.id].push(value.id);
                  v[group.id] = v[group.id].sort(sortString);
                  return { ...v };
                });

                const changeKey = `${group.id}/${value.id}`;
                const ogGroup = original[group.id];
                if (ogGroup) {
                  if (ogGroup.has(value.id))
                    changes.delete(changeKey);
                  else
                    changes.add(changeKey);
                }
                else
                  // the group itself is new
                  // so we should remove sub-changes
                  changes.delete(changeKey);

              };

              return {
                query$,
                displayWith,
                results$,
                onSelect
              } as const;

            })();

            const remove = (id: string) => {
              const original = original$();

              value$.update(v => {
                v[group.id] = v[group.id].filter(s => s !== id);
                return { ...v };
              });

              const changeKey = `${group.id}/${id}`;
              const ogGroup = original[group.id];
              if (ogGroup) {
                if (ogGroup.has(id))
                  changes.add(changeKey);
                else
                  changes.delete(changeKey);
              }
              else
                // the group itself is new
                // so we should remove sub-changes
                changes.delete(changeKey);
            };

            return {
              data: {
                group,
                skills,
              },
              empty,
              add,
              remove
            } as const;
          });

      });

      const empty$ = computed(() => $().length === 0);

      const add = (() => {
        const query$ = signal('' as TechGroup | string);
        const displayWith = (v: TechGroup | string | null) => typeof v === 'string' ? v : v?.name || '';

        const searchable$ = computed(() => {
          const cards = $();
          const list = this.groups.list$();

          const added = new Set(cards.map(c => c.data.group.id));
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

          value$.update(v => {
            v[value.id] = [];
            return { ...v };
          });
          if (value.id in original)
            // even if it was added back,
            // the array is empty
            changes.add(value.id);
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

      const remove = (id: string) => {
        const original = original$();

        value$.update(v => {
          v = { ...v };
          delete v[id];
          return v;
        });

        if (id in original)
          changes.add(id);
        else
          changes.delete(id);
      };

      return {
        $,
        empty$,
        add,
        remove
      } as const;

    })();


    return {
      value$,
      changes,
      cards,
    } as const;

  })();

  protected readonly buttons = (() => {
    const save = (() => {
      const disabled$ = computed(() => !this.table.changes.any$());

      const click = () => {
        const value = this.table.value$();
        const product = this.product$();

        this.store.dispatch(softwareProductActions.updateSkills({
          payload: {
            id: product.id,
            skills: value
          }
        }));

        this.buttons.reset.click();
      };

      return {
        disabled$,
        click
      } as const;

    })();

    const reset = (() => {
      const click = () => {
        const value = structuredClone(this.product$().skills);
        this.table.value$.set(value);
        this.table.changes.clear();
        this.table.cards.add.query$.set('');
      };

      return { click } as const;

    })();

    return { save, reset } as const;
  })();


  public static open(ref: MatDialogRef<DialogLoaderComponent>, data: SoftwareProductSkillsDialogData) {
    DialogLoaderComponent.replace(ref, this, data);
    ref.addPanelClass('w-full');
  }

  ngOnInit() {
    this.buttons.reset.click();
  }
}