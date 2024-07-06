import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, computed, input, output } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBackwardFast, faCaretLeft, faCaretRight, faForwardFast } from '@fortawesome/free-solid-svg-icons';


@Component({
  standalone: true,
  selector: 'paginator',
  templateUrl: './paginator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatRippleModule,
    MatTooltipModule
  ]
})
export class PaginatorComponent {

  @HostBinding() private readonly class = 'flex gap-2 items-center';

  protected readonly icons = {
    faBackwardFast,
    faForwardFast,
    faCaretLeft,
    faCaretRight
  } as const;

  public readonly current$ = input(null, { alias: 'current', transform: coerceNumberProperty });
  public readonly pages$ = input(null, { alias: 'pages', transform: coerceNumberProperty });
  public readonly showFirstLast$ = input(false, { alias: 'showFirstLast', transform: coerceBooleanProperty });
  public readonly disabledPrev$ = input(false, { alias: 'disablePrev', transform: coerceBooleanProperty });
  public readonly disabledNext$ = input(false, { alias: 'disableNext', transform: coerceBooleanProperty });

  public readonly first = output();
  public readonly previous = output();
  public readonly next = output();
  public readonly last = output();

  protected readonly pageDisplay$ = computed(() => {
    const current = this.current$();
    const pages = this.pages$();

    let display: string;
    if (current) {
      display = pages ?
        `${current} of ${pages}` :
        `${current}`;
    }
    else {
      display = pages ?
        `Pages: ${pages}` :
        '';
    }

    return display;
  });

  protected readonly show = {
    current$: computed(() => this.current$ !== null),
    pages$: computed(() => this.pages$ !== null),
  } as const;
}
