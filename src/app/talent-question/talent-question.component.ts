import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  // dataKeys:string[] = []; //For keys
  selected=true;
  firstTime=false;
  name:any={};
  dummyData:any;
  requiredFormat:any={
    button:[],
    option:[],
  };
  datathree:any[]=[];
  completeJobs:any[]=[];
  completeProduct:any[]=[];
  dataKeys:any[] = []; //For keys
  talentQuestionData:any=[];
  filterString='';
  type={
    "socialMedia":"socialMedia"
  }
  countries:any;
  allState:any;
  cities:any;
  enterpriseApplicationGroup='';
  enterpriseApplicationSubGroup='';
  buttonDataFilter='';
  newAttribteExp={"role":"","startDuration":"","endDuration":"","skills":"","clientName":""};
  selectedVideoFiles:any;
  experienceArray:any=[];
  selectedImage:any;
  selectedCountry='';
  selectedCity='';
  selectedState='';
  showProfessionalCodingExperience:boolean = false;
  showemploymentOpportunity:boolean = false;
  jobRole:any=[];
  idToNavigate:any;
  constructor(private httpService: HttpService,
    private router: Router, private route: ActivatedRoute,
    private talentService: TalentService,private http: HttpClient,private toaster: ToasterService,private sessionService: SessionService) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.idToNavigate = +params['id'] || 0;
        console.log(this.idToNavigate);
        if(this.idToNavigate){
          this.changePage(this.idToNavigate);

        }
      });
    this.getDynamicData();
    this.getData();
    this.name.firstName = this.sessionService.getLocalStorageCredentials().firstName;
    this.talentQuestionData.unshift({question:{first:"Select your Primary ",second:"role"},"id":5,type:"mixed","option":this.completeProduct})
    this.talentQuestionData.unshift({question:{first:"Select the ",second:"system phase you have worked"},"id":4,type:"mixed","option":this.completeJobs})
    this.talentQuestionData.unshift({question:{first:"Select the ",second:"module to have specialized"},"id":3,type:"mixed","option":this.datathree})
    this.talentQuestionData.unshift({question:{first:"Select Your Primary Enterprise Application",second:""},"id":2,type:"mixed","option":this.dataKeys})
    this.talentQuestionData.unshift({question:"Professional Summary","id":1,type:"textarea",profileSummary:"",country:{},state:{},city:'',timezone:''})
    this.talentQuestionData.unshift({question:"","id":0,type:"","data":""})
    console.log(this.talentQuestionData);
    console.log(this.currentPage);
    this.getCountry();

  }

   getDynamicData(){
     this.httpService.get('talentProfile/getTalentProfileSteps').subscribe((response: ApiResponse<any>) => {
      if (response.status) {
        this.rootTalentObject = response
        let dataValues = []; //For values
        for (let key in this.rootTalentObject.talentProfile) {
          dataValues.push(this.rootTalentObject.talentProfile[key]);
          this.dataKeys.push({value:key,selected:false,disable:false,noOfYear:'',skill:''});
          this.datathree.push({value:this.rootTalentObject.talentProfile[key]['Primary Domain'],selected:false,disable:false,noOfYear:'',skill:'',group:key});
          for (let key2 in this.rootTalentObject.talentProfile[key].Modules) {
            this.rootTalentObject.talentProfile[key].Modules[key2]['Job roles'].forEach((jobdata:any)=>{
              if(jobdata){

                this.completeJobs.push({value:jobdata,selected:false,disable:false,noOfYear:'',skill:'',group:key,subgroup:key2,primaryDomain:this.rootTalentObject.talentProfile[key]['Primary Domain']});
              }
            });
            this.rootTalentObject.talentProfile[key].Modules[key2].Product.forEach((productdata:any)=>{
              if(productdata){

                this.completeProduct.push({value:productdata.name,selected:false,disable:false,noOfYear:'',skill:'',group:key,subgroup:key2,primaryDomain:this.rootTalentObject.talentProfile[key]['Primary Domain']});
              }
             });

          }
        }
        this.talentOption = this.dataKeys;
        console.log(this.dataKeys)
        console.log(this.datathree)
        console.log(this.completeJobs)
        console.log(this.completeProduct)
      }
    }, (error) => {
      console.log(error);
    });
  }

  getData(){
    return this.http.get('/assets/talentquestion.json').subscribe( (res:any) =>{
      this.talentQuestionData.push(...res);
      console.log(this.talentQuestionData);
    });
  }


  getCountry(){
    this.httpService.get('location/getCountries').subscribe((response: any) => {
      if(response.status){
        this.countries = response.countries;
      }
    });
    console.log(this.countries);
  }
  onSelectCountry(opt:any){
    this.talentQuestionData[1].country = this.countries.find((item:any)=>item.code === opt);
    this.selectedCountry = opt;
    this.getState(opt);
  }
  getCity(stateiso:any){
    const data={
      "countryCode":this.talentQuestionData[1].country.code,
      "stateCode":stateiso
    }
    this.httpService.post('location/getCities',data).subscribe((res:any) => {
      if(res.status){
        this.cities = res.cities
       }
    });
  }
  getState(countryCode:any){
    const data={
      "countryCode":countryCode,
    }
    this.httpService.post('location/getStates',data).subscribe((response: any) => {
      if(response.status){
       this.allState = response.states
      }
    });
  }

  onSelectState(opt:any){
    this.talentQuestionData[1].state = this.allState.find((item:any)=>item.iso === opt);
    this.selectedState = opt;
    this.getCity(opt);
  }

  onSelectCity(opt:any){
    this.talentQuestionData[1].city = this.cities.find((item:any)=>item === opt);
    this.selectedCity = opt;
  }

  onAddExperience(){
   this.talentQuestionData[this.currentPage].experience.push({"role":"","startDuration":"","endDuration":"","skills":"","clientName":""});
  }
  onRemoveExperience(opt:any,i:any){
    this.talentQuestionData[this.currentPage].experience.splice(i,1);
  }
  onAddEducation(){
    this.talentQuestionData[this.currentPage].education.push({"degree":"","specialization":"","startDuration":"","endDuration":"","school":"","address":""});
  }
  onRemoveEducation(opt:any,i:any){
    this.talentQuestionData[this.currentPage].education.splice(i,1);
  }
  onVideoUpload(event:any){
    this.selectedVideoFiles = event.target.files;
  }
  uploadVideo(){
     
  }
  onImage(event:any){
    this.selectedImage = event.target.files[0]
    console.log(this.selectedImage);
    this.uploadImage();
  }
  uploadImage(){
    const uploadData = new FormData();
    uploadData.append('myFile', this.selectedImage, this.selectedImage.name);
    this.httpService.post('talentProfile/setTalentProfilePhoto',uploadData).subscribe((response: ApiResponse<any>) => {
      if (!response.error) {
        this.toaster.success(`${response.message}`);
      }
    }, (error) => {
      console.log(error);
      this.toaster.error(`${error.message}`);
    });
  }
  checkAndShowData(){
    this.talentQuestionData[this.currentPage].option.forEach((element:any)=>{
      if(element.selected=== true){
        this.fieldArray.push(element);
      }
    });
  }
  buttonData(opt:any){
    console.log(opt);
  this.buttonDataFilter = opt.value;
  }
  public changePage(index: number): void {


    this.currentPage += index;
    if(this.currentPage === 7  && this.showProfessionalCodingExperience === false){
      if(index>0){
        this.currentPage = this.currentPage +1;

      }
      else if (index <0){
        this.currentPage = this.currentPage - 1;
      }
 }
    this.width = (this.currentPage / 12) * 100;

    if(this.currentPage === 2 || this.currentPage === 3 || this.currentPage ==4 || this.currentPage === 5 || this.currentPage === 7 || this.currentPage ===8 ){
      this.fieldArray=[];
      this.checkAndShowData();
    }
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


  selectOption(opt: any) {
    if(this.currentPage === 1){ // firstQuestion

    }
    else if(this.currentPage === 2){
      opt.selected= true;
      this.enterpriseApplicationGroup = opt.value;
      this.disableOtherValues(opt);
      this.getDataForFieldArray(opt);
    }
    else if( this.currentPage ===3 || this.currentPage ===4 || this.currentPage === 5){
      if(this.currentPage === 3){
        this.enterpriseApplicationSubGroup = opt.value;
      }
      opt.selected= true;
      opt.disable = true;
      this.getDataForFieldArray(opt);
    }
    else if (this.currentPage === 6){
      opt.selected = !opt.selected;
     if(opt.value === 'NO' && opt.selected === true){
    this.talentQuestionData[this.currentPage].option[0].disable = true;
    this.talentQuestionData[this.currentPage].option[1].disable = false;
    this.showProfessionalCodingExperience = false;
     }
     else if(opt.value === 'YES'  && opt.selected === true){
      this.talentQuestionData[this.currentPage].option[0].disable = false;
     this.talentQuestionData[this.currentPage].option[1].disable = true;
     this.showProfessionalCodingExperience = true;
     }
     else if (opt.selected === false){
      this.talentQuestionData[this.currentPage].option[0].disable = false;
      this.talentQuestionData[this.currentPage].option[1].disable = false;
      this.showProfessionalCodingExperience = false;
     }
    }
    else if( this.currentPage === 7 || this.currentPage ===8){
      opt.selected= true;
      opt.disable = true;
      this.getDataForFieldArray(opt);
    }
    else if (this.currentPage === 9){
        opt.selected = !opt.selected;
        if(opt.subType === 'select'){
        this.talentQuestionData[this.currentPage].data.forEach((element:any)=>{
          if(element.type === 'select'){
            element.option.forEach((optionData:any)=>{
              if(opt.selected === true && opt.firstPart != optionData.firstPart ){
                optionData.disable = true;
              }
              else if(opt.selected === false){
                optionData.disable = false;
              }
            });
          }
    });
  }
  if(opt.selected === true && opt.firstPart ==='Actively Looking For Jobs'){
    this.talentQuestionData[this.currentPage].data[1].visible = true;
  }
  else{
    this.talentQuestionData[this.currentPage].data[1].visible = false;
  }
    }
    else if (this.currentPage === 10){
      opt.selected = !opt.selected;
    }
    else if (this.currentPage === 11){

    }
    else if (this.currentPage === 12){
     //to be decide later
    }
  }


  getDataForFieldArray(opt:any){
    this.talentQuestionData[this.currentPage].option.forEach((element:any)=>{
      if(element.selected === true && element.value.toLowerCase() === opt.value.toLowerCase()){
        this.fieldArray.push({value:opt.value,noOfYear:'',skill:''});
        if(this.currentPage === 4){
          this.jobRole.push({value:opt.value,noOfYear:'',skill:''});
        }
      }
});
  }

  disableOtherValues(opt:any){
    if(this.currentPage === 2){
      this.talentQuestionData[this.currentPage].option.forEach((element:any)=>{
        element.disable = true;
});
    }
    else{
      
    }
  }

  deleteFieldValue(option: any) {
    this.sliceItem(option);
  }

  onInputNoOfYear(opt:any){
    if(this.currentPage === 2){
      this.upDateYearInQues2(opt.event,opt.field);
    }
    else if( this.currentPage ===3 || this.currentPage ===4 || this.currentPage === 5 || this.currentPage === 7 || this.currentPage ===8) {
      this.upDateYear(opt.event,opt.field);
    }
  }
  upDateYearInQues2(value:any,completeData:any){
    this.talentQuestionData[this.currentPage].option.forEach((element:any)=>{
             if(completeData.value.toLowerCase() === element.value.toLowerCase() && element.selected === true){
               element.noOfYear = value;
             }
          });

   this.fieldArray.forEach((element:any)=>{
     if(element.value.toLowerCase() === completeData.value.toLowerCase() ){
          element.noOfYear = value;
     }
   });
  }

  upDateYear(value:any,completeData:any){
    this.talentQuestionData[this.currentPage].option.forEach((element:any)=>{
             if(completeData.value.toLowerCase() === element.value.toLowerCase() && element.selected === true && element.disable ===true){
               element.noOfYear = value;
             }
          });

   this.fieldArray.forEach((element:any)=>{
     if(element.value.toLowerCase() === completeData.value.toLowerCase() ){
          element.noOfYear = value;
     }
   });
  }
  onInputSkill(opt:any){
    if(this.currentPage === 2){
      this.upDateSkillInQues2(opt.event,opt.field);
    }
    else if( this.currentPage ===3 || this.currentPage ===4 || this.currentPage === 5 || this.currentPage === 7 || this.currentPage ===8) {
      this.upDateSkill(opt.event,opt.field);
    }
  }
  upDateSkillInQues2(value:any,completeData:any){
    this.talentQuestionData[this.currentPage].option.forEach((element:any)=>{
             if(completeData.value.toLowerCase() === element.value.toLowerCase()  && element.selected === true){
               element.skill = value;
             }
          });

          this.fieldArray.forEach((element:any)=>{
            if(element.value.toLowerCase() === completeData.value.toLowerCase() ){
                 element.skill = value;
            }
          });
  }

  upDateSkill(value:any,completeData:any){
    this.talentQuestionData[this.currentPage].option.forEach((element:any)=>{
             if(completeData.value.toLowerCase() === element.value.toLowerCase()  && element.selected === true && element.disable === true){
               element.skill = value;
              //  completeData.skill = value;
             }
          });

          this.fieldArray.forEach((element:any)=>{
            if(element.value.toLowerCase() === completeData.value.toLowerCase() ){
                 element.skill = value;
            }
          });
  }
  deleteSelectedOption(field:any){
    if(this.currentPage === 2){
      this.talentQuestionData[this.currentPage].option.forEach((element:any)=>{
        if(element.value.toLowerCase() === field.value.toLowerCase()){
          element.selected = false;
          element.disable = false;
          this.fieldArray = this.fieldArray.filter((item:any) => item.value.toLowerCase() !== field.value.toLowerCase())
        }
        else{
          element.disable = false;
        }
  });
    }
    else if( this.currentPage ===3 || this.currentPage ===4 || this.currentPage === 5 || this.currentPage === 7 || this.currentPage ===8) {
      this.talentQuestionData[this.currentPage].option.forEach((element:any)=>{
        if(element.value.toLowerCase() === field.value.toLowerCase()){
          element.selected = false;
          element.disable = false;
          this.fieldArray = this.fieldArray.filter((item:any) => item.value.toLowerCase() !== field.value.toLowerCase());
          if(this.currentPage === 4){
            this.jobRole = this.jobRole.filter((item:any) => item.value.toLowerCase() !== field.value.toLowerCase())

          }
        }
  });
    }
  }
  enableDisableNextButton(){
    this.disableNextButton = true;
    if(this.currentPage === 1){
      if(this.talentQuestionData[this.currentPage].profileSummary != '' && this.talentQuestionData[this.currentPage].profileSummary.length >200 && this.selectedCity && this.selectedCountry && this.selectedState){
        this.disableNextButton = false;
      }
    }
    else if(this.currentPage === 6){
         if(this.talentQuestionData[this.currentPage].startFreelancing ){
          if(this.talentQuestionData[this.currentPage].option[0].seleced === true && this.talentQuestionData[this.currentPage].startWorkingProfessionally ){
            this.disableNextButton = false;
          }
          else if(this.talentQuestionData[this.currentPage].option[1].seleced === true){
            this.disableNextButton = false;
          }
         }
    }
    else if (this.currentPage===2 || this.currentPage === 3|| this.currentPage === 4 || this.currentPage === 5 || this.currentPage ===7  || this.currentPage ===8){
     this.fieldArray.forEach((element:any)=>{
      if(element.value && element.noOfYear && element.expertise){
           this.disableNextButton = false;
      }
      else{
        this.disableNextButton = true;
      }
      });
    }
    else if(this.currentPage === 9){
      this.disableNextButton = false;
    }
    else if(this.currentPage === 10){
     this.disableNextButton = this.getButtonEnableForTen();
    }
    else if(this.currentPage === 11){
      this.disableNextButton = false;
    }
    else if(this.currentPage === 12){
      this.disableNextButton = this.getButtonEnableForQue12();
    }
  }

  getButtonEnableForTen(){
    let opt = this.talentQuestionData[this.currentPage];
    if(opt.data.desiredHourlyrate && opt.data.targetAnnualSalary && opt.data.monthlyRate && opt.data.selectedPLM && opt.data.weeklyHourlyRate && this.getButtonEnableForMultiSelect(opt.startWorkingWithEasyWork)){
      return false;
    }
    else{
      return true;
    }
  }

  getButtonEnableForQue12(){
    let flag =1;
    let opt = this.talentQuestionData[this.currentPage];
    opt.option.forEach((data:any) =>{
      if(data.value === '' && data.value.length <8){
        flag = 0;
      }
    });
    return !flag;
  }

  getButtonEnableForMultiSelect(multiselectData:any){
    let flag =0;
    for(var i= 0;i<multiselectData.length;i++){
             if(multiselectData[i].selected === true){
               flag = 1;
             }
           }
  return flag;
  }

  getButtonEnableForSelect(selectData:any){
    let flag =0;
    selectData.forEach((element:any)=>{
              if(element.selected=== true && element.disable=== false){
                flag =1;
              }
            });
    return flag;
  }

  goToMyProfile() {
    let talent:any = this.talentQuestionData;
    let data:any={
      userId: this.sessionService.getLocalStorageCredentials()._id,
      steps:JSON.stringify(talent)
    }
    this.httpService.post('talentProfile/createTalentProfile',data).subscribe((response: ApiResponse<any>) => {
      if (!response.error) {
        this.toaster.success(`${response.message}`);
        // this.router.navigate(['/Talentprofileview']);
      }
    }, (error) => {
      console.log(error);
      this.toaster.error(`${error.message}`);
    });
  }

  getanswerData(){
    let answer:any=[];
    this.talentQuestionData.forEach((data:any)=>{
     if(data.id ===1){
      answer.push({id:data.id,profileSummary:data.profileSummary,city:data.city,country:data.country,state:data.state,timezone:data.timezone})
     }
     else if(data.id === 6 ){
      answer.push({id:data.id,startFreelancing:data.startFreelancing,startWorkingProfessionally:data.startWorkingProfessionally,selectedYesNo:''});
      data.option.forEach((opt:any)=>{
         if(opt.selected === true){
           answer[data.id].selectedYesNo=opt.value;
         }
      })
    }
     else if( data.id ===2 &&  data.id === 3 &&  data.id === 4 &&  data.id === 5 &&  data.id === 8 &&  data.id === 7){
       answer.push({id:data.id,option:[]})
      data.option.forEach((opt:any)=>{
         if(opt.selected === true){
           answer[data.id].option.push({value:opt.value,skill:opt.skill,noOfYear:opt.noOfYear})
         }
      });
      if(data.button.length){
        data.option.forEach((opt:any)=>{
        answer[data.id].button.push({value:opt.value})
        });
      }
     }
    else if(data.id ===9){

    }
    else if(data.id ===10){

    }
    else if(data.id ===11){

    }
    else if(data.id ===12){

    }
    })
  }
}
