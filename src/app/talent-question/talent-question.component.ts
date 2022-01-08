import { Component, OnInit } from '@angular/core';
import { ApiResponse } from '../_models';
import { TalentProfileSteps, TalentProfileStepsPost } from '../_models/taltent-profile-steps';
import { HttpService } from '../_services/http.service';
import { TalentService } from '../_services/talent.service';
import { TalentQuestionDynamicComponent } from './talent-question-dynamic-step/talent-question-dynamic.component';

@Component({
  selector: 'app-talent-question',
  templateUrl: './talent-question.component.html',
  styleUrls: []
})
export class TalentQuestionComponent implements OnInit {
  public currentPage = 0;
  public width = 0;
  public primaryEnterpriseApplication: string[] = [];
  profileSteps: TalentProfileSteps = new TalentProfileSteps(null);
  talentOption: any;
  rootTalentObject: any;
  dyanmicOption: string[] = [];
  profileStepsPost: TalentProfileStepsPost[] = new Array<TalentProfileStepsPost>();

  constructor(private httpService: HttpService,
    private talentService: TalentService) { }

  ngOnInit(): void {
    this.httpService.get('talentProfile/getTalentProfileSteps').subscribe((response: ApiResponse<any>) => {
      if (response.status) {
        this.rootTalentObject = response
        let dataValues = []; //For values
        let dataKeys = []; //For keys
        for (let key in this.rootTalentObject.talentProfile) {
          dataValues.push(this.rootTalentObject[key]);
          dataKeys.push(key);
        }
        this.talentOption = dataKeys;
      }
    }, (error) => {
      console.log(error);
    });
  }

  public changePage(index: number): void {
    if (this.currentPage == 2 && this.dyanmicOption.length > 0) {
      let dyanmicArr: string[] = [];
      this.dyanmicOption.forEach(element => {
        for (let key in this.rootTalentObject.talentProfile[element]) {
          dyanmicArr.push(key);
        }
      });
      this.talentOption = dyanmicArr;
    }
    else {
      this.currentPage += index;
      this.width = (this.currentPage / 33) * 100;
    }

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

  nextPage(event: string) {
    this.dyanmicOption.push(event);
    console.log(this.dyanmicOption);
  }

  sliceItem(event: string) {
    this.dyanmicOption.splice(this.dyanmicOption.indexOf(event), 1);
    console.log(this.dyanmicOption);
  }

}

export enum QuestionEnums {
  EnterpriseApplication,
  EnterpriseApplicationSoftware
}
