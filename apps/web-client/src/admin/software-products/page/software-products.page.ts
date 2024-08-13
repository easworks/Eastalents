import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal, untracked } from "@angular/core";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from "@angular/material/select";
import { DialogLoaderComponent } from '@easworks/app-shell/common/dialog-loader.component';
import { FormImportsModule } from "@easworks/app-shell/common/form.imports.module";
import { ImportsModule } from "@easworks/app-shell/common/imports.module";
import { PaginatorComponent } from '@easworks/app-shell/common/paginator/paginator.component';
import { generateLoadingState } from "@easworks/app-shell/state/loading";
import { faCheck, faPen, faPlus, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { Store } from '@ngrx/store';
import Fuse from 'fuse.js';
import { SoftwareProduct } from 'models/software';
import { Subscription, firstValueFrom, map } from 'rxjs';
import { domainData, softwareProductActions } from 'app-shell/state/domain-data';

@Component({
  standalone: true,
  selector: 'software-products-page',
  templateUrl: './software-products.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatAutocompleteModule,
    PaginatorComponent
  ]
})
export class SoftwareProductsPageComponent {
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

  protected readonly loading = generateLoadingState<[
    'updating software product',
  ]>();

  private readonly domains = (() => {
    const map$ = this.store.selectSignal(domainData.selectors.domains.selectEntities);

    return {
      map$
    } as const;
  })();

  private readonly products = (() => {
    const list$ = this.store.selectSignal(domainData.selectors.softwareProduct.selectAll);

    const search$ = computed(() => new Fuse(list$(), {
      keys: ['name'],
      includeScore: true
    }));

    return {
      list$,
      search$
    } as const;
  })();

  protected readonly search = (() => {
    const query$ = signal('');

    const result$ = computed(() => {
      const q = query$().trim();

      if (!q)
        return this.products.list$();

      const options = untracked(this.products.search$).search(q);
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
        imageUrl: new FormControl('', { nonNullable: true }),
      };
    };

    const rows = (() => {

      const updating = generateLoadingState<string[]>();
      this.loading.react('updating software product', updating.any$);

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

        const allDomains = this.domains.map$();

        return view$().map(sp => {
          const domains = (() => {
            const list = sp.domains.map(id => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              return allDomains[id]!;
            });

            const edit = () => this.editDomains(sp.id);

            return {
              list,
              edit
            } as const;
          })();

          const form = new FormGroup({ ...rowControls() });

          const changeCheck = (value: typeof form['value']) =>
            value.name === sp.name &&
            value.imageUrl === sp.imageUrl;

          const valid$ = signal(form.status === 'VALID');
          const unchanged$ = signal(changeCheck(form.value));

          const disableButtons$ = computed(() => this.loading.any$() || unchanged$());

          const reset = {
            click: () => {
              form.reset({
                name: sp.name,
                imageUrl: sp.imageUrl
              });
            },
            disabled$: disableButtons$
          } as const;

          const submit = {
            click: () => {
              if (!form.valid)
                return;

              try {
                updating.add(sp.id);
                const value = form.getRawValue();
                const payload: SoftwareProduct = {
                  ...sp,
                  name: value.name,
                  imageUrl: value.imageUrl,
                };
                this.store.dispatch(softwareProductActions.update({ payload }));
              }
              finally {
                updating.delete(sp.id);
              }
            },
            disabled$: computed(() => disableButtons$() || !valid$()),
            loading$: updating.has(sp.id)
          } as const;


          rowSubs.add(form.statusChanges
            .pipe(map(s => s === 'VALID'))
            .subscribe(valid$.set),

          );
          rowSubs.add(form.valueChanges
            .pipe(map(changeCheck))
            .subscribe(unchanged$.set)
          );


          reset.click();

          const skills = () => this.editSkills(sp.id);

          return {
            data: sp,
            domains,
            form,
            submit,
            reset,
            skills
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
      const comp = await import('../create/create-software-product.dialog')
        .then(m => m.CreateSoftwareProductDialogComponent);
      comp.open(ref, {
        created: id =>
          this.editSkills(id)
            .then(ref => firstValueFrom(ref.afterClosed().pipe(takeUntilDestroyed(this.dRef))))
            .then(() => this.editDomains(id))
      });
    };

    return {
      click,
    } as const;
  })();

  private readonly editSkills = async (id: string) => {
    const ref = DialogLoaderComponent.open(this.dialog);
    const comp = await import('../skills/software-product-skills.dialog')
      .then(m => m.SoftwareProductSkillsDialogComponent);

    comp.open(ref, {
      product: id
    });
    return ref;
  };

  private readonly editDomains = async (id: string) => {
    const ref = DialogLoaderComponent.open(this.dialog);
    const comp = await import('../domains/software-product-domains.dialog')
      .then(m => m.SoftwareProductDomainsDialogComponent);

    comp.open(ref, {
      product: id
    });

    return ref;
  };
}