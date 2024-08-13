import { ChangeDetectionStrategy, Component, computed, effect, HostBinding, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthApi } from '@easworks/app-shell/api/auth.api';
import { ClearTriggerOnSelectDirective } from '@easworks/app-shell/common/clear-trigger-on-select.directive';
import { controlStatus$ } from '@easworks/app-shell/common/form-field.directive';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { AuthService } from '@easworks/app-shell/services/auth';
import { domainData } from '@easworks/app-shell/state/domain-data';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { sleep } from '@easworks/app-shell/utilities/sleep';
import { sortString } from '@easworks/app-shell/utilities/sort';
import { faFacebook, faGithub, faGoogle, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faCheck, faCircleCheck, faCircleInfo, faSquareXmark } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import Fuse from 'fuse.js';
import { RETURN_URL_KEY } from 'models/auth';
import { Domain } from 'models/domain';
import { ExternalIdentityProviderType, ExternalIdpUser } from 'models/identity-provider';
import { pattern } from 'models/pattern';
import { map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'talent-sign-up-form',
  templateUrl: './talent-sign-up-form.component.html',
  styleUrl: './talent-sign-up-form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule,
    RouterModule,
    MatStepperModule,
    MatAutocompleteModule,
    ClearTriggerOnSelectDirective
  ]
})
export class TalentSignUpFormComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly snackbar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  private readonly api = {
    auth: inject(AuthApi)
  } as const;

  @HostBinding()
  private readonly class = 'block @container';

  protected readonly icons = {
    faGoogle,
    faGithub,
    faLinkedinIn,
    faFacebook,
    faCheck,
    faSquareXmark,
    faCircleInfo,
    faCircleCheck
  } as const;

  private readonly loading = generateLoadingState<[
    'signing up'
  ]>();

  protected readonly query$ = toSignal(this.route.queryParams, { requireSync: true });
  protected readonly socialPrefill$ = toSignal(this.route.data.pipe(map(d => d['socialPrefill'])), { requireSync: true });

  private readonly returnUrl$ = toSignal(this.route.queryParamMap.pipe(map(q => q.get(RETURN_URL_KEY))), { requireSync: true });

  protected readonly accountBasics = (() => {
    const showSocial$ = computed(() => !this.socialPrefill$());
    const readOnly$ = computed(() => !!this.socialPrefill$());

    const formId = 'talent-sign-up-account-basics';
    const form = new FormGroup({
      username: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      firstName: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      lastName: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.pattern(pattern.password)],
        nonNullable: true
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
    }, {
      validators: [
        (c) => {
          const isMatch = c.value.password === c.value.confirmPassword;
          if (isMatch)
            return null;
          else
            return { passwordMismatch: true };
        }
      ],
      updateOn: 'submit'
    });

    effect(() => {
      const stopEmit = { onlySelf: true, };
      const prefill = this.socialPrefill$()?.externalUser as ExternalIdpUser | undefined;
      if (prefill) {
        form.controls.password.disable(stopEmit);
        form.controls.confirmPassword.disable(stopEmit);

        form.reset({}, stopEmit);
        form.patchValue({
          firstName: prefill.firstName,
          lastName: prefill.lastName,
          email: prefill.email,
          username: (`${prefill.firstName}_${prefill.lastName}`).toLowerCase()
        }, stopEmit);
      }
      else {
        form.controls.password.enable(stopEmit);
        form.controls.confirmPassword.enable(stopEmit);

        form.reset({}, stopEmit);
      }

      form.updateValueAndValidity();

    });

    const status$ = toSignal(controlStatus$(form), { requireSync: true });
    const valid$ = computed(() => status$() === 'VALID');

    const submit = {
      click: async (stepper: MatStepper) => {
        if (!form.valid)
          return;
        await sleep();
        stepper.next();
      },
      // click: () => {
      //   if (!form.valid)
      //     return;

      //   const fv = form.getRawValue();
      //   const prefill = this.socialPrefill$();

      //   const input: SignUpInput = {
      //     username: fv.username,
      //     firstName: fv.firstName,
      //     lastName: fv.lastName,
      //     email: fv.email,
      //     role: 'talent',
      //     credentials: prefill ?
      //       {
      //         provider: prefill.idp,
      //         accessToken: prefill.externalUser.credential
      //       } :
      //       {
      //         provider: 'email',
      //         password: fv.password
      //       }
      //   };

      //   this.loading.add('signing up');

      //   this.api.auth.signup(input)
      //     .pipe(
      //       switchMap(output => {
      //         if (output.action === 'sign-in') {
      //           return this.auth.signIn.token(output.data.access_token, this.returnUrl$() || undefined);
      //         }
      //         else {
      //           return this.router.navigateByUrl('/verify-email');
      //         }
      //       }),
      //       catchError((err: ProblemDetails) => {
      //         SnackbarComponent.forError(this.snackbar, err);
      //         return EMPTY;
      //       }),
      //       finalize(() => this.loading.delete('signing up'))
      //     ).subscribe();
      // },
      disabled$: this.loading.any$,
      loading$: this.loading.has('signing up')
    } as const;


    return {
      formId,
      form,
      submit,
      valid$,
      readOnly$,
      showSocial$
    } as const;

  })();

  protected readonly domains = (() => {
    const map$ = this.store.selectSignal(domainData.selectors.domains.selectEntities);
    const list$ = this.store.selectSignal(domainData.selectors.domains.selectAll);

    const chips$ = signal<{
      id: string;
      name: string;
    }[]>([]);

    const count$ = computed(() => chips$().length);
    const valid$ = computed(() => {
      const c = count$();
      return c > 0 && c <= 3;
    });

    const remove = (idx: number) => {
      chips$.update(value => {
        value.splice(idx, 1);
        return [...value];
      });
    };

    const add = (() => {
      const query$ = signal('' as Domain | string);
      const displayWith = (v: Domain | string | null) => typeof v === 'string' ? v : v?.longName || '';

      const searchable$ = computed(() => {
        const chips = chips$();
        const list = list$();

        const added = new Set(chips.map(r => r.id));
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
        const value = event.option.value as Domain;

        chips$.update(v => {
          v.push({
            id: value.id,
            name: value.longName
          });

          v.sort((a, b) => sortString(a.id, b.id));

          return [...v];
        });
        query$.set('');
      };

      const allowed$ = computed(() => count$() < 3);

      return {
        query$,
        displayWith,
        results$,
        onSelect,
        allowed$
      } as const;
    })();

    const submit = {
      click: async (stepper: MatStepper) => {
        if (!valid$())
          return;
        await sleep();
        stepper.next();
      },
      disabled$: computed(() => this.loading.any$() || !valid$()),
    } as const;

    return {
      chips$,
      count$,
      valid$,
      add,
      remove,
      submit
    } as const;
  })();


  socialSignUp(provider: ExternalIdentityProviderType) {
    this.auth.signUp.social(provider, 'talent', this.returnUrl$() || undefined);
  }
}