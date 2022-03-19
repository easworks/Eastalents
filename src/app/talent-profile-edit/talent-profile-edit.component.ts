import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from '../_models';
import { HttpService } from '../_services/http.service';
import { SessionService } from '../_services/session.service';
import { TalentService } from '../_services/talent.service';
import { ToasterService } from '../_services/toaster.service';

@Component({
  selector: 'app-talent-profile-edit',
  templateUrl: './talent-profile-edit.component.html',
  providers: [TalentService],
  styleUrls: []
})
export class TalentProfileEditComponent implements OnInit {

  talentProfileData:any=[]; 
  talentQuestionData:any=[];
  dataToDisplay:any={};  
  personalData:any={};
  groups:any=[];
randomTechData:any=[];

  constructor(private http: HttpClient,private router: Router,private httpService: HttpService,
    private route: ActivatedRoute,private toaster: ToasterService,private sessionService: SessionService,
    private talentService: TalentService,) { }

  ngOnInit(): void {
    this.getTalentProfile();

  }

  getTalentProfile(){
    let data:any={
      userId: this.sessionService.getLocalStorageCredentials()._id
    }
    this.httpService.post('talentProfile/getTalentProfile',data).subscribe((response:any) => {
      if (!response.error) {
        this.toaster.success(`${response.message}`);
        this.talentQuestionData = response.steps;
        this.formatData();
      }
    }, (error) => {
      console.log(error);
      this.toaster.error(`${error.message}`);
    });
  }

  getData(){
    return this.http.get('/assets/talentquestion.json').subscribe( (res:any) =>{
      this.talentQuestionData.push(...res);
      console.log(this.talentQuestionData);
      this.formatData();
    });
  }

  formatData(){
    let arrData=[];
    const list = this.talentQuestionData[8].button.map( (i:any) => i.value);
   this.groups= list.map( (c:any) => { 
            return  { group:c, option:[]};
        } ); 

  
    this.groups.forEach((data:any)=>{
      arrData = this.talentQuestionData[8].option.filter((item:any) => item.group === data.group && item.selected === true);
      data.option.push(...arrData);
});
  

  console.log(list);
  console.log(this.groups);
  this.RandomCollectData();
  this.saveRequiredData();
      }

  RandomCollectData(){
    this.groups.forEach((data:any) =>{
      if(data.option.length){
        let techData = data.option[Math.floor(Math.random() * data.option.length)];
        this.randomTechData.push(techData);
      }
    });
    console.log(this.randomTechData);
  }

  saveRequiredData(){
    this.personalData.firstName = this.sessionService.getLocalStorageCredentials().firstName;
    this.personalData.lastName = this.sessionService.getLocalStorageCredentials().lastName;
    this.personalData.email = this.sessionService.getLocalStorageCredentials().email;
    this.dataToDisplay.profileSummary=this.talentQuestionData[1].profileSummary;
    this.dataToDisplay.city=this.talentQuestionData[1].city;
    this.dataToDisplay.state=this.talentQuestionData[1].state;
    this.dataToDisplay.country=this.talentQuestionData[1].country;
    this.dataToDisplay.phoneNumber=this.talentQuestionData[12].phonenumber;
    this.dataToDisplay.LinkedIn=this.talentQuestionData[13].option[2].value;
    this.dataToDisplay.GitLab=this.talentQuestionData[13].option[0].value;
    this.dataToDisplay.weeklyHourlyRate=this.talentQuestionData[11].data.weeklyHourlyRate;
    this.dataToDisplay.targetAnnualSalary=this.talentQuestionData[11].data.targetAnnualSalary;
    this.dataToDisplay.monthlyRate=this.talentQuestionData[11].data.monthlyRate;
    this.dataToDisplay.desiredHourlyRate=this.talentQuestionData[11].data.desiredHourlyRate;
  }

      onUpdate(opt:any){
        this.router.navigate(['/talentprofilequestion'],{state:{data :this.talentQuestionData} ,queryParams: { id: opt } });
        // this.talentService.invokeTalentData(this.talentQuestionData);
      }
      takeTest(){
        this.router.navigate(['/question-category']);
      }
}
