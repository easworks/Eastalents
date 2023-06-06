type PromiseExecutor<T> = ConstructorParameters<typeof Promise<T>>[0];
type Resolver<T> = Parameters<PromiseExecutor<T>>[0];
type Rejector<T> = Parameters<PromiseExecutor<T>>[1];

export class Deferred<T = void> extends Promise<T> {

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(executor: PromiseExecutor<T> = () => { }) {
    let _resolve: Resolver<T>;
    let _reject: Rejector<T>;
    super((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
      executor(resolve, reject);
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.resolve = _resolve!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.reject = _reject!;
  }

  resolve!: Resolver<T>;
  reject!: Rejector<T>;
}
