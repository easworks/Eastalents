import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject ,Observable } from 'rxjs';
import { TalentProfileSteps } from '../_models/taltent-profile-steps';

@Injectable({
  providedIn: 'root'
})
export class TalentService {
  public stepModal: TalentProfileSteps[] = []

  private talentData = new Subject<any>();
  public talentDataObservable = this.talentData.asObservable();
  constructor(private http: HttpClient) {
  }

  invokeTalentData(x: any){
    this.talentData.next(x);
  }
}

