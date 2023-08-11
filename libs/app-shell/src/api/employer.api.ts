import { Injectable } from '@angular/core';
import { BackendApi } from './backend';

@Injectable({
  providedIn: 'root'
})
export class EmployerApi extends BackendApi {
  readonly profile = {
  } as const;
}
