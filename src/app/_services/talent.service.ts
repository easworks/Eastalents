import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TalentProfileStepsPost } from '../_models/taltent-profile-steps';

@Injectable()
export class TalentService {
  public stepModal: TalentProfileStepsPost[] = []
  constructor(private http: HttpClient) {
  }
}

