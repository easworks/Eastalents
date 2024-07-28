import { inject } from '@angular/core';
import { ENVIRONMENT } from '../environment';
import { ApiService } from './api';

export class EasworksApi extends ApiService {
  protected readonly apiUrl = inject(ENVIRONMENT).apiUrl;
}
