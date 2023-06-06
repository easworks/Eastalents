import { APP_INITIALIZER, Provider } from '@angular/core';

/** Forces the creation of service instances even when it is not injected in any component */
export function provideRootServices(...providers: Provider[]): Provider {
  return {
    provide: APP_INITIALIZER,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    useFactory: () => () => { },
    deps: providers,
    multi: true
  }
}
