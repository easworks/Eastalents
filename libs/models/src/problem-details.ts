export class ProblemDetails {
  status = 500;
  type = 'unknown-error';
  title?: string;
  detail?: string;
  instance?: string;
  [key: string]: unknown;

  static fromError(err: Error) {
    const pd = new ProblemDetails();
    pd.title = err.message || undefined;
    return pd;
  }

  static fromObject(err: unknown) {
    if (!this.isProblemDetails(err))
      throw new Error('cannot create problem details - invalid structure');
    const pd = new ProblemDetails();
    Object.assign(pd, err);
    return pd;
  }

  static isProblemDetails(obj: unknown) {
    if (obj instanceof ProblemDetails)
      return true;
    if (obj && this.isAbstractMatch(obj))
      return 'abstract';
    return false;
  }

  private static isAbstractMatch(obj: object) {
    return Object.getPrototypeOf(obj) === Object.prototype &&
      'status' in obj &&
      'type' in obj &&
      typeof obj.status === 'number' &&
      typeof obj.type === 'string';
  }
}

export class ErrorWithMetadata extends Error {
  metadata: Record<string, unknown> = {};

  withMetadata(key: string, value: unknown) {
    this.metadata[key] = value;
    return this;
  }

  public toProblemDetails() {
    const pd = ProblemDetails.fromError(this);
    Object.assign(pd, this.metadata);
    return pd;
  }
}

export class ErrorWithCode extends ErrorWithMetadata {
  constructor(public code: string) {
    super();
  }

  public override toProblemDetails() {
    const pd = super.toProblemDetails();
    pd.type = this.code;
    return pd;
  }
}
