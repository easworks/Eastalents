import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TalentProfileSteps } from '../_models/taltent-profile-steps';

@Injectable()
export class TalentService {
  public stepModal: TalentProfileSteps[] = []
  constructor(private http: HttpClient) {
  }
}

