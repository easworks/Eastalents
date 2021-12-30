import { Component, OnInit } from '@angular/core';
import { ApiResponse } from '../_models';
import { TalentProfileSteps } from '../_models/taltent-profile-steps';
import { HttpService } from '../_services/http.service';
import { TalentQuestionDynamicComponent } from './talent-question-dynamic-step/talent-question-dynamic.component';

@Component({
  selector: 'app-talent-question',
  templateUrl: './talent-question.component.html',
  styleUrls: []
})
export class TalentQuestionComponent implements OnInit {
  profileSteps: any;//TalentProfileSteps = new TalentProfileSteps(null);

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.httpService.get('talentProfile/getTalentProfileSteps').subscribe((response: ApiResponse<any>) => {
      if (response.status) {
        console.log(response);
        this.profileSteps = response;
        console.log(this.profileSteps);
      }
    }, (error) => {
      console.log(error);
    });
  }

  public currentPage = 0;
  public width = 0;
  public primaryEnterpriseApplication:string[] = [];
  public changePage(index: number): void {
    this.currentPage += index;
    this.width = (this.currentPage / 33) * 100;
  }

  public storeQuestionData(qty: QuestionEnums, val: string) {
    switch (qty) {
      case QuestionEnums.EnterpriseApplication:
        this.primaryEnterpriseApplication.push(val);
        break;

      default:
        break;
    }
  }


}

export enum QuestionEnums {
  EnterpriseApplication,
  EnterpriseApplicationSoftware
}
