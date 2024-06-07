import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, HostBinding, Injector, StaticProvider, ViewContainerRef, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'dialog-loader',
  template: `
  <mat-spinner mode=indeterminate diameter="24"></mat-spinner>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatProgressSpinnerModule
  ]
})
export class DialogLoaderComponent {

  public readonly vcRef = inject(ViewContainerRef);

  @HostBinding() private readonly class = '!block p-2';

  public static open(dialog: MatDialog) {
    return dialog.open(DialogLoaderComponent, { disableClose: true });
  }

  public static async replace(
    ref: MatDialogRef<DialogLoaderComponent>,
    comp: ComponentType<unknown>,
    data?: unknown) {
    const cRef = ref.componentRef;

    if (!cRef)
      throw new Error('dialog loader replacement is only implemented for class-based dialogs');

    const injector = cRef.injector;

    const providers: StaticProvider[] = [
      { provide: MAT_DIALOG_DATA, useValue: data },
    ];

    const cp = new ComponentPortal(
      comp,
      null,
      Injector.create({ providers, parent: injector })
    );

    cRef.destroy();
    ref._containerInstance._portalOutlet.detach();
    ref._containerInstance.attach(cp);
    ref.disableClose = false;
  }

}