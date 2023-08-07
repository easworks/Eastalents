import { isDevMode } from '@angular/core';
export class ApiService {
  private readonly devMode = isDevMode();

  protected async verifyOk(response: Response) {
    if (!response.ok) {
      const body = await response.json();
      throw body;
    }

    return response;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected readonly handleError = (error: any) => {
    let errorMessage = '';
    if (error instanceof ErrorEvent) {
      if (this.devMode)
        console.error('client error', error);
      errorMessage = error.message;
    } else {
      if (this.devMode)
        console.error('server error', error);
      errorMessage = error.message || error.status;
    }

    throw new Error(errorMessage);
  }
}