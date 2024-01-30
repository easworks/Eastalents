import { DestroyRef, Injectable, InjectionToken, Signal, WritableSignal, inject, signal } from '@angular/core';
import { Action, ActionCreator, ActionType } from '@ngrx/store';
import { Subject, filter } from 'rxjs';

type Executor<T extends Action> = (a: T) => void;

@Injectable()
class Actions {
  constructor() {
    const implementation = new Subject<Action>();

    inject(DestroyRef).onDestroy(() => {
      implementation.complete();
    });

    implementation.subscribe(this.reducerStream);
    implementation.subscribe(this.effectStream);

    this.dispatch = implementation.next.bind(implementation);
    this.pipe = this.effectStream.pipe.bind(this.effectStream);
    this.subscribe = this.effectStream.subscribe.bind(this.effectStream);
  }

  private readonly reducerStream = new Subject<Action>;
  private readonly effectStream = new Subject<Action>;

  register<T extends ActionCreator>(action: T, executor: Executor<ActionType<T>>) {
    return this.reducerStream
      .pipe(ofType(action))
      .subscribe(a => executor(a));
  }

  readonly dispatch;
  readonly subscribe;
  readonly pipe;
}

export const ACTIONS = new InjectionToken('', {
  providedIn: 'platform',
  factory: () => new Actions()
});

export function on<S, AC extends ActionCreator>(
  actionCreator: AC,
  reducer: (state: S, action: ActionType<AC>) => S
) {
  return (actions: Actions, state$: WritableSignal<S>) => {
    actions.register<AC>(
      actionCreator,
      action => state$.update(v => reducer(v, action))
    );
  };
}

export type OnReducer<
  S,
  AC extends ActionCreator = ActionCreator
> = ReturnType<typeof on<S, AC>>;

export type SelectorFactory<S, R = object> = (state$: Signal<S>) => R;

type WithActions<A> = A extends undefined ? NonNullable<unknown> : { actions: A; };
type WithSelectors<S> = S extends undefined ? NonNullable<unknown> : { selectors: S; };

export function createFeature<T, A = undefined, S = undefined>(
  { initialState, reducers, actions, selectors, initEffects }: {
    initialState: T,
    reducers: OnReducer<T>[],
    actions?: A,
    selectors?: SelectorFactory<T, S>,
    initEffects?: () => void;
  }
) {
  return new InjectionToken('', {
    providedIn: 'root',
    factory: () => {
      const state$ = signal(initialState, { equal: () => false });
      const actions$ = inject(ACTIONS);
      reducers.forEach(r => r(actions$, state$));

      const result = {
        $: state$.asReadonly(),
      } as const;

      if (actions)
        Object.assign(result, { actions });
      if (selectors)
        Object.assign(result, { selectors: selectors(state$) });

      initEffects?.();

      return result as Readonly<typeof result & WithActions<A> & WithSelectors<S>>;
    }
  });
}

export function ofType<T extends ActionCreator>(action: T) {
  return filter((a: Action): a is ActionType<T> => a.type === action.type);
}
