import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ClearTriggerOnSelectDirective } from '@easworks/app-shell/common/clear-trigger-on-select.directive';
import { DialogLoaderComponent } from '@easworks/app-shell/common/dialog-loader.component';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { sortString } from '@easworks/app-shell/utilities/sort';
import { faRemove, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import Fuse from 'fuse.js';
import { Domain } from '../../models/domain';
import { SoftwareProduct } from '../../models/tech-skill';
import { adminData, softwareProductActions } from '../../state/admin-data';

interface SoftwareProductDomainsDialogData {
  product: string;
}

@Component({
  standalone: true,
  selector: 'software-product-domains-dialog',
  templateUrl: './software-product-domains.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    MatDialogModule,
    FormImportsModule,
    MatAutocompleteModule,
    ClearTriggerOnSelectDirective
  ]
})
export class SoftwareProductDomainsDialogComponent implements OnInit {

  private readonly data = inject<SoftwareProductDomainsDialogData>(MAT_DIALOG_DATA);
  private readonly store = inject(Store);

  protected readonly icons = {
    faXmark,
    faRemove
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


  private readonly domains = (() => {
    const map$ = this.store.selectSignal(adminData.selectors.domains.selectEntities);
    const list$ = this.store.selectSignal(adminData.selectors.domains.selectAll);

    return {
      map$,
      list$
    } as const;
  })();


  protected readonly table = (() => {

    const changes = generateLoadingState<string[]>();

    const original$ = computed(() => new Set(this.product$().domains));

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
      const query$ = signal('' as Domain | string);
      const displayWith = (v: Domain | string | null) => typeof v === 'string' ? v : v?.longName || '';

      const searchable$ = computed(() => {
        const rows = rows$();
        const list = this.domains.list$();

        const added = new Set(rows.map(r => r.id));
        return list.filter(s => !added.has(s.id));
      });

      const search$ = computed(() => new Fuse(searchable$(), {
        keys: ['longName', 'shortName'],
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
        const value = event.option.value as Domain;

        rows$.update(v => {
          v.push({
            id: value.id,
            name: value.longName
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
        const value: SoftwareProduct['domains'] = this.table.rows$()
          .map(row => row.id);

        this.store.dispatch(softwareProductActions.updateDomains({
          payload: {
            id: this.product$().id,
            domains: value
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
        const domains = this.domains.map$();
        const product = this.product$();
        const value = product.domains.map(id => ({
          id,
          name: domains[id]?.longName || ''
        }));

        this.table.rows$.set(value);
        this.table.changes.clear();
        this.table.add.query$.set('');
      };

      return { click } as const;
    })();

    return { save, reset } as const;
  })();

  public static open(ref: MatDialogRef<DialogLoaderComponent>, data: SoftwareProductDomainsDialogData) {
    DialogLoaderComponent.replace(ref, this, data);
    ref.addPanelClass('w-80');
  }

  ngOnInit() {
    this.buttons.reset.click();
  }

}