import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, HostBinding, inject, INJECTOR, signal, untracked, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthApi } from '@easworks/app-shell/api/auth.api';
import { ClearTriggerOnSelectDirective } from '@easworks/app-shell/common/clear-trigger-on-select.directive';
import { controlStatus$ } from '@easworks/app-shell/common/form-field.directive';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { AuthService } from '@easworks/app-shell/services/auth';
import { domainData } from '@easworks/app-shell/state/domain-data';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { sleep } from '@easworks/app-shell/utilities/sleep';
import { sortString } from '@easworks/app-shell/utilities/sort';
import { zodValidator } from '@easworks/app-shell/validators/zod';
import { faGithub, faGoogle, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faCheck, faCircleCheck, faCircleInfo, faSquareXmark } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import Fuse from 'fuse.js';
import { RETURN_URL_KEY } from 'models/auth';
import { Domain } from 'models/domain';
import { ExternalIdentityProviderType, ExternalIdpUser } from 'models/identity-provider';
import { pattern } from 'models/pattern';
import { ProblemDetails } from 'models/problem-details';
import { SoftwareProduct } from 'models/software';
import { SignUpInput, ValidateEmailExistsInput, ValidateUsernameExistsInput } from 'models/validators/auth';
import { username } from 'models/validators/common';
import { catchError, delay, EMPTY, finalize, map, of, switchMap, tap } from 'rxjs';

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
  private readonly dRef = inject(DestroyRef);
  private readonly injector = inject(INJECTOR);

  private readonly api = {
    auth: inject(AuthApi)
  } as const;

  @HostBinding()
  private readonly class = 'block @container';

  protected readonly icons = {
    faGoogle,
    faGithub,
    faLinkedinIn,
    faCheck,
    faSquareXmark,
    faCircleInfo,
    faCircleCheck
  } as const;

  private readonly loading = generateLoadingState<[
    'signing up',
    'validating username exists',
    'validating email exists',
  ]>();

  protected readonly query$ = toSignal(this.route.queryParams, { requireSync: true });

  private readonly returnUrl$ = toSignal(this.route.queryParamMap.pipe(map(q => q.get(RETURN_URL_KEY))), { requireSync: true });

  protected readonly prefill = (() => {
    const routeInfo$ = toSignal<{
      idp: ExternalIdentityProviderType,
      externalUser: ExternalIdpUser,
      token: string;
    } | null>(this.route.data.pipe(map(d => d['socialPrefill'])), { requireSync: true });

    const canUse$ = computed(() => !!routeInfo$());

    return {
      routeInfo$,
      canUse$
    } as const;
  })();

  private readonly stepper$ = viewChild.required<MatStepper>('stepper');

  protected readonly accountBasics = (() => {
    const formId = 'talent-sign-up-account-basics';

    const validators = {
      username: {
        pattern: zodValidator(
          username.plain,
          undefined, err => {
            const issue = err.issues[0];
            switch (issue.code) {
              case 'too_small': return `min. ${issue.minimum} characters`;
              case 'too_big': return `max. ${issue.maximum} characters`;
              case 'invalid_string': return `Allowed characters: 'a-z', '0-9' and '_'`;
              case 'custom':
                switch (issue.message) {
                  case 'no-underscore-at-start': return 'Cannot have underscore at start';
                  case 'no-underscore-at-end': return 'Cannot have underscore at end';
                  case 'no-consecutive-underscores': return 'Cannot have consecutive underscores';
                }
                return issue.message;
            }
            return issue.code;
          }),
        exists: (control: AbstractControl) => of(control.value).pipe(
          delay(500),
          tap(() => this.loading.add('validating username exists')),
          switchMap(value => {
            const input: ValidateUsernameExistsInput = {
              username: '@' + value
            };
            return this.api.auth.validate.usernameExists(input);
          }),
          map(v => v ? { exists: true } : null),
          catchError(e => {
            SnackbarComponent.forError(this.snackbar, e);
            return [{ validationFailed: true }];
          }),
          finalize(() => this.loading.delete('validating username exists'))
        )
      },
      emailExists: (control: AbstractControl) => of(control.value).pipe(
        delay(500),
        tap(() => this.loading.add('validating email exists')),
        switchMap(value => {
          const input: ValidateEmailExistsInput = {
            email: value
          };
          return this.api.auth.validate.emailExists(input);
        }),
        map(v => v ? { exists: true } : null),
        catchError(e => {
          SnackbarComponent.forError(this.snackbar, e);
          return [{ validationFailed: true }];
        }),
        finalize(() => this.loading.delete('validating email exists'))
      )
    };

    const form = new FormGroup({
      username: new FormControl('', {
        validators: [
          Validators.required,
          validators.username.pattern
        ],
        nonNullable: true,
        asyncValidators: [validators.username.exists]
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
        nonNullable: true,
        asyncValidators: [validators.emailExists]
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
          const { password, confirmPassword } = c.value;
          const isMatch = password === confirmPassword;
          if (isMatch)
            return null;
          else
            return { passwordMismatch: true };
        }
      ],
    });

    effect(() => {
      const stopEmit = { onlySelf: true, emitEvent: false };
      const canUse = this.prefill.canUse$();
      const externalUser = this.prefill.routeInfo$()?.externalUser;

      if (canUse) {
        form.controls.password.disable(stopEmit);
        form.controls.confirmPassword.disable(stopEmit);
      }
      else {
        form.controls.password.enable(stopEmit);
        form.controls.confirmPassword.enable(stopEmit);
      }

      if (externalUser) {
        form.reset({
          firstName: externalUser.firstName,
          lastName: externalUser.lastName,
          email: externalUser.email,
          username: externalUser.firstName.toLowerCase()
        });
      }
      else {
        form.reset({});
      }
    }, { allowSignalWrites: true });

    const status$ = toSignal(controlStatus$(form), { requireSync: true });
    const valid$ = computed(() => status$() === 'VALID');

    const validating = {
      username$: this.loading.has('validating username exists'),
      email$: this.loading.has('validating email exists')
    } as const;

    const submit = {
      click: async () => {
        if (!form.valid)
          return;
        await sleep();
        this.stepper$().next();
      },
      disabled$: computed(() => this.loading.any$() || !valid$()),
      loading$: this.loading.has('signing up')
    } as const;


    return {
      formId,
      form,
      submit,
      valid$,
      validating
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
      click: () => {
        if (!valid$())
          return;
        this.stepper$().next();
      },
      disabled$: computed(() => this.loading.any$() || !valid$()),
    } as const;

    const value$ = computed(() => {
      const chips = chips$();
      const map = untracked(map$);

      return chips.map(c => map[c.id]!);
    });

    return {
      chips$,
      value$,
      count$,
      valid$,
      add,
      remove,
      submit
    } as const;
  })();

  protected readonly software = (() => {
    const map$ = this.store.selectSignal(domainData.selectors.softwareProduct.selectEntities);

    const list$ = computed(() => {
      const domains = this.domains.value$();
      const map = untracked(map$);

      const software = new Set<string>();

      domains.forEach(d => d.products.forEach(p => software.add(p)));

      return [...software].map(id => map[id]!);
    });

    const chips$ = signal<{
      id: string;
      name: string;
    }[]>([]);

    const count$ = computed(() => chips$().length);
    const valid$ = computed(() => {
      const c = count$();
      return c > 0 && c <= 10;
    });

    const remove = (idx: number) => {
      chips$.update(value => {
        value.splice(idx, 1);
        return [...value];
      });
    };

    const add = (() => {
      const query$ = signal('' as SoftwareProduct | string);
      const displayWith = (v: SoftwareProduct | string | null) => typeof v === 'string' ? v : v?.name || '';

      const searchable$ = computed(() => {
        const chips = chips$();
        const list = list$();

        const added = new Set(chips.map(r => r.id));
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
        const value = event.option.value as SoftwareProduct;

        chips$.update(v => {
          v.push({
            id: value.id,
            name: value.name
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
      click: () => {
        if (!valid$())
          return;
        this.stepper$().next();
      },
      disabled$: computed(() => this.loading.any$() || !valid$()),
    } as const;

    const value$ = computed(() => {
      const chips = chips$();
      const map = untracked(map$);

      return chips.map(c => map[c.id]!);
    });

    return {
      chips$,
      value$,
      count$,
      valid$,
      add,
      remove,
      submit
    } as const;
  })();


  protected readonly consent = (() => {
    const submit = (() => {
      const click = () => {

        const fv = this.accountBasics.form.getRawValue();
        const prefill = this.prefill.canUse$() && this.prefill.routeInfo$();

        const input: SignUpInput = {
          username: fv.username,
          firstName: fv.firstName,
          lastName: fv.lastName,
          email: fv.email,
          role: 'talent',
          credentials: prefill ?
            {
              provider: prefill.idp,
              token: prefill.token
            } :
            {
              provider: 'email',
              password: fv.password
            }
        };

        this.loading.add('signing up');

        this.api.auth.signup(input)
          .pipe(
            switchMap(output => {
              if (output.action === 'sign-in') {
                return this.auth.signIn.token(output.data.access_token, this.returnUrl$() || undefined);
              }
              else {
                return this.router.navigateByUrl('/verify-email');
              }
            }),
            catchError((err: ProblemDetails) => {
              SnackbarComponent.forError(this.snackbar, err);
              return EMPTY;
            }),
            finalize(() => this.loading.delete('signing up'))
          ).subscribe();
      };

      const loading$ = this.loading.has('signing up');
      const valid$ = computed(() => this.accountBasics.valid$() && this.domains.valid$() && this.software.valid$());
      const disabled$ = computed(() => this.loading.any$() || !valid$());

      return {
        click,
        loading$,
        disabled$
      } as const;
    })();

    return {
      submit
    } as const;
  })();

  socialSignUp(provider: ExternalIdentityProviderType) {
    this.auth.signUp.social(provider, 'talent', this.returnUrl$() || undefined);
  }
}