import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ClearTriggerOnSelectDirective } from '@easworks/app-shell/common/clear-trigger-on-select.directive';
import { DialogLoaderComponent } from '@easworks/app-shell/common/dialog-loader.component';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

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
export class SoftwareProductDomainsDialogComponent {

  protected readonly icons = {
    faXmark
  } as const;


  public static open(ref: MatDialogRef<DialogLoaderComponent>, data: SoftwareProductDomainsDialogData) {
    DialogLoaderComponent.replace(ref, this, data);
    ref.addPanelClass('w-80');
  }

}