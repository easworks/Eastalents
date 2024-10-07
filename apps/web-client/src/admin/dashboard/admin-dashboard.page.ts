import { Component, computed, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { DomainsApi } from '@easworks/app-shell/api/domains.api';
import { FileUploadComponent } from '@easworks/app-shell/common/file-upload/file-upload.component';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { SnackbarComponent, SuccessSnackbarDefaults } from '@easworks/app-shell/notification/snackbar';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { saveJSON } from '@easworks/app-shell/utilities/files';
import { Store } from '@ngrx/store';
import { domainData, domainDataActions } from 'app-shell/state/domain-data';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  selector: 'admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  imports: [
    ImportsModule,
    RouterModule,
    FormImportsModule,
    FileUploadComponent
  ]
})
export class AdminDashboardPageComponent {
  private readonly store = inject(Store);
  protected readonly snackbar = inject(MatSnackBar);
  protected readonly api = {
    domains: inject(DomainsApi)
  } as const;

  private readonly loading = generateLoadingState<[
    'uploading json',
    'downloading json',
    'saving to db'
  ]>();

  protected readonly upload = (() => {
    const file$ = signal<File | null>(null);
    const loading$ = this.loading.has('uploading json');
    const disabled$ = computed(() => file$() === null || this.loading.any$());

    const click = async () => {
      const file = file$();
      if (!file)
        return;

      try {
        this.loading.add('uploading json');
        const dto = JSON.parse(await file.text());
        this.store.dispatch(domainDataActions.updateState({ payload: dto }));
        this.store.dispatch(domainDataActions.saveState());
        file$.set(null);
        this.snackbar.openFromComponent(SnackbarComponent, {
          ...SuccessSnackbarDefaults
        });
      }
      catch (e) {
        SnackbarComponent.forError(this.snackbar, e);
      }
      finally {
        this.loading.delete('uploading json');
      }
    };

    return {
      file$,
      loading$,
      disabled$,
      click
    } as const;
  })();

  protected readonly download = (() => {
    const loading$ = this.loading.has('downloading json');
    const disabled$ = this.loading.any$;

    const click = async () => {
      try {
        this.loading.add('downloading json');
        const dto$ = this.store.selectSignal(domainData.feature.selectDto);
        await new Promise<void>(resolve => {
          saveJSON(dto$(), 'eas-admin-data.json');
          resolve();
        });
      }
      finally {
        this.loading.delete('downloading json');
      }
    };

    return {
      loading$,
      disabled$,
      click
    } as const;
  })();

  protected readonly saveToDatabase = (() => {
    const loading$ = this.loading.has('saving to db');
    const disabled$ = this.loading.any$;

    const click = async () => {

      this.loading.add('saving to db');
      const dto$ = this.store.selectSignal(domainData.feature.selectDto);
      this.api.domains.data.set(dto$())
        .pipe(
          finalize(() => this.loading.delete('saving to db'))
        ).subscribe();
    };

    return {
      loading$,
      disabled$,
      click
    } as const;
  })();
}