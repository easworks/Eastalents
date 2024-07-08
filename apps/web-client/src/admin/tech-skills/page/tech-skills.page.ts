import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogLoaderComponent } from '@easworks/app-shell/common/dialog-loader.component';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { PaginatorComponent } from '@easworks/app-shell/common/paginator/paginator.component';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { faCheck, faPen, faPlus, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import Fuse from 'fuse.js';
import { Subscription, map } from 'rxjs';
import { TechSkill } from '../../models/tech-skill';
import { adminData, techSkillActions } from '../../state/admin-data';

@Component({
  standalone: true,
  selector: 'tech-skills-page',
  templateUrl: './tech-skills.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule,
    PaginatorComponent
  ]
})
export class TechSkillsPageComponent {
  private readonly store = inject(Store);
  private readonly dRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);

  protected readonly icons = {
    faCheck,
    faRefresh,
    faPlus,
    faPen
  } as const;

  protected readonly maxlength = { name: 64 } as const;

  private readonly loading = generateLoadingState<[
    'updating tech skill',
  ]>();

  private readonly skills = (() => {
    const list$ = this.store.selectSignal(adminData.selectors.techSkill.selectAll);

    const search$ = computed(() => new Fuse(list$(), {
      keys: ['name'],
      includeScore: true
    }));


    return {
      list$,
      search$
    } as const;
  })();

  private readonly techGroups$ = this.store.selectSignal(adminData.selectors.techGroup.selectEntities);

  protected readonly search = (() => {

    const query$ = signal('');

    const result$ = computed(() => {
      const q = query$().trim();

      if (!q)
        return this.skills.list$();

      const options = untracked(this.skills.search$).search(q);
      return options.map(o => o.item);
    });

    return {
      query$,
      result$
    } as const;
  })();

  protected readonly table = (() => {

    const paginator = (() => {

      const resetScroll = () => window.scrollTo({ top: 0, behavior: 'smooth' });

      const current$ = signal(1);
      const pages$ = computed(() => {
        const total = this.search.result$().length;
        return Math.ceil(total / 100);
      });

      effect(() => {
        pages$();
        current$.set(1);
      }, { allowSignalWrites: true });

      const prev = {
        disabled$: computed(() => current$() <= 1),
        click: () => {
          current$.update(v => --v);
          resetScroll();
        }
      } as const;
      const first = () => {
        current$.set(1);
        resetScroll();
      };

      const next = {
        disabled$: computed(() => current$() >= pages$()),
        click: () => {
          current$.update(v => ++v);
          resetScroll();
        }
      } as const;
      const last = () => {
        current$.set(pages$());
        resetScroll();
      };

      return {
        current$,
        pages$,
        first,
        prev,
        next,
        last
      } as const;
    })();

    const rowControls = () => {
      return {
        name: new FormControl('', {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.maxLength(this.maxlength.name)
          ]
        }),
      };
    };

    const rows = (() => {
      const updating = generateLoadingState<string[]>();
      this.loading.react('updating tech skill', updating.any$);

      let rowSubs = new Subscription();
      this.dRef.onDestroy(() => rowSubs.unsubscribe());

      const view$ = computed(() => {
        const results = this.search.result$();
        const itemsPerPage = 100;
        const start = (paginator.current$() - 1) * itemsPerPage;
        return results.slice(start, start + itemsPerPage);
      });

      const $ = computed(() => {
        rowSubs.unsubscribe();
        rowSubs = new Subscription();

        const techGroups = untracked(this.techGroups$);

        return view$().map(skill => {
          const form = new FormGroup({ ...rowControls() });

          const changeCheck = (value: typeof form['value']) =>
            value.name === skill.name;

          const valid$ = signal(form.status === 'VALID');
          const unchanged$ = signal(changeCheck(form.value));

          const disableButtons$ = computed(() => this.loading.any$() || unchanged$());

          const reset = {
            click: () => {
              form.reset({
                name: skill.name
              });
            },
            disabled$: disableButtons$
          } as const;

          const submit = {
            click: () => {
              if (!form.valid)
                return;

              try {
                updating.add(skill.id);
                const value = form.getRawValue();
                const payload: TechSkill = {
                  ...skill,
                  name: value.name
                };

                this.store.dispatch(techSkillActions.update({ payload }));
              }
              finally {
                updating.delete(skill.id);
              }
            },
            disabled$: disableButtons$,
            loading$: updating.has(skill.id)
          } as const;

          const groups = (() => {
            const list = skill.groups.map((id) => ({
              id,
              label: techGroups[id]?.name
            }));

            const edit = async () => this.editGroups(skill.id);

            return { list, edit } as const;
          })();

          rowSubs.add(form.statusChanges
            .pipe(map(s => s === 'VALID'))
            .subscribe(valid$.set),

          );
          rowSubs.add(form.valueChanges
            .pipe(map(changeCheck))
            .subscribe(unchanged$.set)
          );

          reset.click();

          return {
            data: skill,
            form,
            submit,
            reset,
            groups
          };
        });
      });

      return {
        $
      } as const;
    })();

    const empty$ = computed(() => rows.$().length === 0);

    return {
      rows,
      empty$,
      paginator
    } as const;

  })();

  protected readonly create = (() => {
    const click = async () => {
      const ref = DialogLoaderComponent.open(this.dialog);
      const comp = await import('../create/create-tech-skill.dialog')
        .then(m => m.CreateTechSkillDialogComponent);
      comp.open(ref, {
        created: id => this.editGroups(id)
      });
    };

    return {
      click,
    } as const;
  })();

  private readonly editGroups = async (id: string) => {
    const ref = DialogLoaderComponent.open(this.dialog);
    const comp = await import('../groups/tech-skill-groups.dialog')
      .then(m => m.TechSkillGroupsDialogComponent);

    comp.open(ref, {
      skill: id
    });
  };
}