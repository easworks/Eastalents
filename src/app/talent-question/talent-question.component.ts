import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from '../_models';
import { TalentProfile, TalentProfileSteps } from '../_models/taltent-profile-steps';
import { HttpService } from '../_services/http.service';
import { TalentService } from '../_services/talent.service';
import { TalentQuestionDynamicComponent } from './talent-question-dynamic-step/talent-question-dynamic.component';

@Component({
  selector: 'app-talent-question',
  templateUrl: './talent-question.component.html',
  providers: [TalentService],
  styleUrls: []
})
export class TalentQuestionComponent implements OnInit {
  public currentPage = 0;
  public dyanmicStepNum = 2;
  public width = 0;
  public primaryEnterpriseApplication: string[] = [];
  profileSteps: TalentProfileSteps = new TalentProfileSteps();
  talentOption: any;
  rootTalentObject: any;
  dyanmicOption: string[] = [];
  talentProfile: TalentProfile = new TalentProfile(32);
  fieldArray: Array<any> = [];
  jobs: string[] = [];
  product: string[] = [];
  profileSummary: string = "";

  constructor(private httpService: HttpService,
    private router: Router,
    private talentService: TalentService) {
  }

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
    this.fieldArray = [];
    this.currentPage += index;
    this.width = (this.currentPage / 32) * 100;

    if (this.currentPage == 4)
      this.talentOption = this.jobs;
    if (this.currentPage == 5)
      this.talentOption = this.product;

    if (this.currentPage == 2 ||
      this.currentPage == 3 ||
      this.currentPage == 4 ||
      this.currentPage == 5)
      this.dyanmicStepNum = this.currentPage;

    //change step
    if ((this.currentPage == 2 || this.currentPage == 3) && this.dyanmicOption.length > 0) {
      let dyanmicArr: string[] = [];
      this.dyanmicOption.forEach(element => {
        for (let key in this.rootTalentObject.talentProfile[element]) {
          dyanmicArr.push(key);
          if (this.currentPage == 3) {
            this.jobs.push(...this.rootTalentObject.talentProfile[element][key]["Jobs"]);
            this.product.push(...this.rootTalentObject.talentProfile[element][key]["Product"]);
          }
        }
      });

      if (this.currentPage == 2 || this.currentPage == 3)
        this.talentOption = dyanmicArr;
    }

    if (this.currentPage > 1) {
      //maintain post object
      // var objTalentProfileStepsPost = new TalentProfileSteps();
      // objTalentProfileStepsPost.id = this.currentPage - 1;
      // objTalentProfileStepsPost.step = "step " + (this.currentPage - 1);
      // this.talentService.stepModal.push(objTalentProfileStepsPost);
      console.log(this.talentProfile);
    }
  }

  nextPage(event: string) {
    this.dyanmicOption.push(event);
    this.fieldArray.push(event);
  }

  sliceItem(event: string) {
    this.dyanmicOption.splice(this.dyanmicOption.indexOf(event), 1);
    this.fieldArray.splice(this.dyanmicOption.indexOf(event), 1);
  }


  selectOption(option: any) {
    this.nextPage(option.target.innerText);
  }

  deleteFieldValue(option: any) {
    this.sliceItem(option);
  }

  goToMyProfile() {
    this.router.navigate(['/Talentprofileview']);
  }

}
