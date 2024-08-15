import { Component, HostBinding, computed, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { FileUploadComponent } from '@easworks/app-shell/common/file-upload/file-upload.component';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { SnackbarComponent, SuccessSnackbarDefaults } from '@easworks/app-shell/notification/snackbar';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { saveJSON } from '@easworks/app-shell/utilities/files';
import { Store } from '@ngrx/store';
import { domainData, domainDataActions } from 'app-shell/state/domain-data';

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

  private readonly loading = generateLoadingState<[
    'uploading json',
    'downloading json'
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
}