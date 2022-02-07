import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { element } from 'protractor';
import { ObservableLike } from 'rxjs';
import { ApiResponse } from '../_models';
import { TalentProfile, TalentProfileSteps } from '../_models/taltent-profile-steps';
import { HttpService } from '../_services/http.service';
import { SessionService } from '../_services/session.service';
import { TalentService } from '../_services/talent.service';
import { ToasterService } from '../_services/toaster.service';
import { TalentQuestionDynamicComponent } from './talent-question-dynamic-step/talent-question-dynamic.component';

@Component({
  selector: 'app-talent-question',
  templateUrl: './talent-question.component.html',
  providers: [TalentService],
  styleUrls: []
})
export class TalentQuestionComponent implements OnInit {
  disableNextButton=false;
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
  savePreviousData: Array<any> = [];
  jobs: string[] = [];
  product: string[] = [];
  profileSummary: string = "";
  ToSendOnProfileData:any={};
  dataKeys:string[] = []; //For keys
  socialMediaLink={
    linkedIn:"",
    gitHub:"",
    gitLab:"",
    bitBucket:"",
    stackOverflow:"",
    portfolio:"",
    otherUrl:"",
    type:'SocialMediaLink'
  }
  expectation={
    desiredHourlyRate:"",
    monthlyRate:"",
    annualSalary:"",
    type:'Expectation'
  }
  jobSearch=[
    {selected:false,type:'jobSearch' ,firstPart:'Actively Looking For Jobs',secondPart:'We will match you with all available job opportunities'},
    {selected:false,type:'jobSearch' ,firstPart:'Passively Looking For the Right Opportunity',secondPart:'We will send you a daily digest of jobs that match your profile'},
    {selected:false,type:'jobSearch' ,firstPart:'Not Currently Looking for new work',secondPart:'We will pause job match emails but keep your account active'}
  ]
  selected=true;

  experience={
    startFreelancing:'',
    isChecked:false,
    startWorkingProfessionally:'',
    type:'experience'
  }
  employmentOpportunity=[
    {selected:false,type:'employmentOpportunity' ,firstPart:'Freelance or Contact work -',secondPart:'Short Term',thirdPart:'(1-3 Months)'},
    {selected:false,type:'employmentOpportunity' ,firstPart:'Freelance or Contact work -',secondPart:'Long Term',thirdPart:'(3-36 Months)'},
    {selected:false,type:'employmentOpportunity' ,firstPart:'Fulltime Salaried Employee',secondPart:'' ,thirdPart:''},
    {selected:false,type:'employmentOpportunity' ,firstPart:' Any of the above',secondPart:'' ,thirdPart:''},
  ]
  englishFluencyLevel=[
    {selected:false,type:'englishFluencyLevel' ,secondPart:'No Practical proficiency (Google translates me)',firstPart:''},
    {selected:false,type:'englishFluencyLevel' ,firstPart:'Basic',secondPart:'- I can Read, write & speak basic English'},
    {selected:false,type:'englishFluencyLevel' ,firstPart:'Fluent',secondPart:'I can Read, understand, write ,speak & comprehend English with no trouble.'},
    {selected:false,type:'englishFluencyLevel' ,firstPart:'Professional',secondPart:' – I have advance level of proficiency & can communicate in complex & cognitively demanding situation.' ,},
    {selected:false,type:'englishFluencyLevel' ,secondPart:'Excellent Native/Bilingual -English is my primary & native language',firstPart:''},
  ]
  startWorkingWithEasyWork=[
    {selected:false,type:'startWorkingWithEasyWork' ,data:'Immediately'},
    {selected:false,type:'startWorkingWithEasyWork' ,data:'In 1 Week'},
    {selected:false,type:'startWorkingWithEasyWork' ,data:'In 2 Weeks'},
    {selected:false,type:'startWorkingWithEasyWork' ,data:'In 3 Weeks',},
    {selected:false,type:'startWorkingWithEasyWork' ,data:'In 1 Month'},
    {selected:false,type:'startWorkingWithEasyWork' ,data:'In more than 1 month'},
  ]
  firstTime=false;
  name:any={};
  year:any=[
    {value:2000},
    {value:2001},
    {value:2002},
    {value:2003},
    {value:2004},
    {value:2005},
    {value:2006},
    {value:2007},
    {value:2008},
    {value:2009},
    {value:2010},
    {value:2011},
    {value:2012},
    {value:2013},
    {value:2014},
    {value:2015},
    {value:2016},
    {value:2018},
    {value:2019},
    {value:2020},
    {value:2021},
    {value:2022},
    

    

  ]

  constructor(private httpService: HttpService,
    private router: Router,
    private talentService: TalentService,private toaster: ToasterService,private sessionService: SessionService) {
  }

  ngOnInit(): void {
    this.name.firstName = this.sessionService.getLocalStorageCredentials().firstName;
    this.httpService.get('talentProfile/getTalentProfileSteps').subscribe((response: ApiResponse<any>) => {
      if (response.status) {
        this.rootTalentObject = response
        let dataValues = []; //For values
        for (let key in this.rootTalentObject.talentProfile) {
          dataValues.push(this.rootTalentObject[key]);
          this.dataKeys.push(key);
        }
        this.talentOption = this.dataKeys;
      }
    }, (error) => {
      console.log(error);
    });

  }

  public changePage(index: number): void {
    let saveNextData: Array<any> = [];
      if(this.fieldArray.length){
        saveNextData = this.fieldArray;
        this.fieldArray=[];
      }
      if(!(this.currentPage === 25 || this.currentPage ===32 || this.currentPage ===27 || this.currentPage ===28)){
        this.pushObjects(saveNextData);

      }
      console.log(this.talentProfile);
      saveNextData=[];
      // this.enableDisableNextButton();
      this.firstTime= false;
    if (this.currentPage > 1 && index ===1 ) {
      //maintain post object
      if(!(this.currentPage ===30 || this.currentPage ===26 || this.currentPage === 31 || this.currentPage ===28 ||this.currentPage ===25 || this.currentPage ===32 || this.currentPage ===27)){
        this.preserveData(index);

      }
    }
    else if(this.currentPage > 1 && index=== -1){
      if(!(this.currentPage ===30 || this.currentPage ===26|| this.currentPage === 31 || this.currentPage ===25 || this.currentPage ===32 || this.currentPage ===27 || this.currentPage ===28)){
     this.preserveData(index);
      }
    }
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

      if (this.currentPage == 3)
        this.talentOption = dyanmicArr;
    }
    if(this.currentPage==2){
      this.talentOption = this.dataKeys;
    }

    
  }

  pushObjects(opt:any){
    if(this.currentPage === 30){
      this.updateValue(this.socialMediaLink);
    }
    else if(this.currentPage === 31){
      this.updateValue(this.expectation);
    }
    else if(this.currentPage === 26){
     this.updateValue(this.experience);

    }
    else{
    opt.forEach((element:any) => {
      this.talentProfile.stepObject[this.currentPage - 1].optionObj.push(element);
    });
  }

  }

  updateValue(data:any){
    let updateArray = this.talentProfile.stepObject[this.currentPage - 1].optionObj;
    if(updateArray.length >0){
      updateArray.forEach((element:any)=>{
        for (const key in data) {
          if(data[key] != element[key]){
            element[key]=data[key];
          }
  // console.log(`${key}: ${user[key]}`);
      }
      });  
    }
    else if (updateArray.length === 0){
      updateArray.push(data);
      // this.enableDisableNextButton();

    }
    data={};
  }

  nextPage(event: string) {
    this.fieldArray.push({value:event,noOfYear:'',expertise:''});
    // this.enableDisableNextButton();
    if(this.currentPage ==2){
    this.dyanmicOption.push(event);
    }
  }

  sliceItem(event: string) {
    this.removeItem(event);
    if(this.currentPage ==2){
    this.dyanmicOption.splice(this.dyanmicOption.indexOf(event), 1);
    }
  }

  removeItem(option:any){
    if(this.fieldArray.length){
      for(var i=0;i<this.fieldArray.length;i=i+1){
          if(this.fieldArray[i].value === option.value){
            this.fieldArray.splice(i,1);
          }
    }
  }
    if(this.savePreviousData.length){
      for(var i=0;i<this.savePreviousData.length;i=i+1){
        if(this.savePreviousData[i].value === option.value){
          this.savePreviousData.splice(i,1);
        }
  }
    }
     let savedData= this.talentProfile.stepObject[this.currentPage-1].optionObj[0]
    if(savedData.length){
      for(var i=0;i<savedData.length;i=i+1){
          if(savedData[i].value === option.value){
            savedData.splice(i,1);
          }
    }
  }
  }


  selectOption(option: any) {
    this.nextPage(option.target.innerText);
  }

  deleteFieldValue(option: any) {
    this.sliceItem(option);
  }

   private preserveData(index:any){
     this.savePreviousData=[];
  if(index ===1){
    if(this.talentProfile.stepObject[this.currentPage].optionObj.length){
      this.talentProfile.stepObject[this.currentPage].optionObj.forEach((element:any) => {
          this.savePreviousData.push(element);
      });

    }
  }
  else if (index === -1){
    if(this.talentProfile.stepObject[this.currentPage-2].optionObj.length){
      this.talentProfile.stepObject[this.currentPage-2].optionObj.forEach((element:any) => {
          this.savePreviousData.push(element);
      });

    }
  }

  }

  clickJobSearch(option:any){
    if(this.firstTime === false){
      // this.enableDisableNextButton();
      this.firstTime = true;
    }
    console.log(this.jobSearch);
    this.talentProfile.stepObject[this.currentPage-1].optionObj.length=0;
   this.jobSearch.forEach((element:any)=>{
    if(element.firstPart === option.firstPart){
        element.selected = this.selected;
        this.talentProfile.stepObject[this.currentPage-1].optionObj.push(option);
        console.log(this.talentProfile);
    }
    else{
      element.selected = false;
    }
   });
   
  }
  onStartWorkingWithEayWork(option:any){
    if(this.firstTime === false){
      // this.enableDisableNextButton();
      this.firstTime = true;
    }
    this.talentProfile.stepObject[this.currentPage-1].optionObj.length=0;
   this.startWorkingWithEasyWork.forEach((element:any)=>{
    if(element.data === option.data){
        element.selected = this.selected;
        this.talentProfile.stepObject[this.currentPage-1].optionObj.push(option);
        console.log(this.talentProfile);
    }
    else{
      element.selected = false;
    }
   });
  }

  clickemploymentOpportunity(option:any){
    if(this.firstTime === false){
      // this.enableDisableNextButton();
      this.firstTime = true;
    }
    option.selected = !option.selected;
   this.employmentOpportunity.forEach((element:any)=>{
    if(element.firstPart === option.firstPart && element.secondPart === option.secondPart){
      if(element.selected === true){
        this.talentProfile.stepObject[this.currentPage-1].optionObj.push(option);
        console.log(this.talentProfile);
      }
      else if(element.selected === false && this.talentProfile.stepObject[this.currentPage-1].optionObj.length >0){
        this.talentProfile.stepObject[this.currentPage-1].optionObj.splice(this.talentProfile.stepObject[this.currentPage-1].optionObj.indexOf(option),1)
      }

    }
   });
  }
  clickEnglishFluencyLevel(option:any){
    if(this.firstTime === false){
      // this.enableDisableNextButton();
      this.firstTime = true;
    }
    this.talentProfile.stepObject[this.currentPage-1].optionObj.length=0;
   this.englishFluencyLevel.forEach((element:any)=>{
    if(element.secondPart === option.secondPart){
        element.selected = this.selected;
        this.talentProfile.stepObject[this.currentPage-1].optionObj.push(option);
        console.log(this.talentProfile);
    }
    else{
      element.selected = false;
    }
   });
  }
  enableDisableNextButton(){
    this.disableNextButton = true;
    if(this.currentPage === 0){
      this.disableNextButton = false;
    }
    else if (this.currentPage==-26 || this.currentPage === 30|| this.currentPage === 31 || this.currentPage === 25 || this.currentPage ===32 || this.currentPage ===27 || this.currentPage ===28){
      this.disableNextButton = false;
    }
    else{
      this.disableNextButton = false;
      // this.fieldArray.forEach((element:any)=>{
      // if(element.value && element.noOfYear && element.expertise){
      //      this.disableNextButton = false;
      // }
      // else{
      //   this.disableNextButton = true;
      // }
      // });
    }
  }

  goToMyProfile() {
    let talent:any = this.talentProfile;
    let data:any={
      userId: this.sessionService.getLocalStorageCredentials()._id,
      steps:JSON.stringify(talent)
    }
    this.httpService.post('talentProfile/createTalentProfile',data).subscribe((response: ApiResponse<any>) => {
      if (!response.error) {
        this.toaster.success(`${response.message}`);
        this.router.navigate(['/Talentprofileview']);
      }
    }, (error) => {
      console.log(error);
      this.toaster.error(`${error.message}`);
    });
  }
}
