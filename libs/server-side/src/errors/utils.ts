import { StatusCodes } from 'http-status-codes';
import { ErrorWithCode } from 'models/problem-details';

export class ApiError extends ErrorWithCode {
  constructor(
    code: string,
    public status: StatusCodes
  ) {
    super(code);
  }

  withStatus(code: StatusCodes) {
    this.status = code;
    return this;
  }

  public override toProblemDetails() {
    const pd = super.toProblemDetails();
    pd.status = this.status;
    return pd;
  }
}

