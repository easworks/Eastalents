import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from '../_models';
import { TalentProfile, TalentProfileSteps } from '../_models/taltent-profile-steps';
import { HttpService } from '../_services/http.service';
import { SessionService } from '../_services/session.service';
import { TalentService } from '../_services/talent.service';
import { ToasterService } from '../_services/toaster.service'; 

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
  talentDataToUpdate:any=[];
  filterString='';
  type={
    "socialMedia":"socialMedia"
  }
  countries:any;
  allState:any;
  cities:any;
  enterpriseApplicationGroup='';
  enterpriseApplicationSubGroup:any=[];
  buttonDataFilter='';
  newAttribteExp={"role":"","startDuration":"","endDuration":"","skills":"","clientName":""};
  selectedVideoFiles:any;
  experienceArray:any=[];
  selectedImage:any;
  selectedPDF:any;
  selectedCountry='';
  selectedCity='';
  selectedState='';
  showProfessionalCodingExperience:boolean = false;
  showemploymentOpportunity:boolean = false;
  jobRole:any=[];
  idToNavigate:any;
  completePhase:any=[];
  preferredPLM='';
  currentPLM='';
  editMode = true;
  resume='';
  selectedVideo='';
  showUpdateButton:boolean =false;
  constructor(private httpService: HttpService,
    private router: Router, private route: ActivatedRoute,
    private talentService: TalentService,private http: HttpClient,
    private toaster: ToasterService,private sessionService: SessionService) {
      this.talentDataToUpdate = this.router.getCurrentNavigation()?.extras.state;
  }

  ngOnInit(): void {
        // Defaults to 0 if no query param provided.
        this.idToNavigate =  +this.route.snapshot.queryParams['id'] || 0;
        this.name.firstName = this.sessionService.getLocalStorageCredentials().firstName;
        this.getCountry();
        if(this.idToNavigate){
          this.editMode = false;
          this.showUpdateButton = true;
          this.talentQuestionData = this.talentDataToUpdate.data;
          this.showProfessionalCodingExperience = this.idToNavigate === 8 || this.idToNavigate === 7  ? true :false;
          this.currentPLM = this.talentQuestionData[11].data.currentPLM;
          this.preferredPLM = this.talentQuestionData[11].data.preferredPLM;
          this.talentQuestionData[6].option.forEach((element:any)=>{
            if(element.selected === true){
              this.jobRole.push({value:element.value,noOfYear:'',skill:''});
            }
          });
          this.selectedCountry = this.talentQuestionData[1].country.code;
          this.getState(this.selectedCountry);
          this.selectedState = this.talentQuestionData[1].state.iso;
          this.getCity(this.selectedCountry,this.selectedState);
          this.selectedCity = this.talentQuestionData[1].city;
          this.changePage(this.idToNavigate);
          this.talentQuestionData[2].option.forEach((element:any)=>{
            if(element.selected === true){
              this.enterpriseApplicationGroup = element.value;
            }
          });
          this.talentQuestionData[3].option.forEach((element:any)=>{
            if(element.selected === true){
              this.enterpriseApplicationSubGroup.push(element.value);
            }
          });
         
        }
        else{
          this.initializeValue();
        }

  }

  initializeValue(){
    this.getDynamicData();
    this.getData();
    this.getDataForSystemPhase();
    this.talentQuestionData.unshift({question:{first:"Select your Primary ",second:"role"},"id":6,type:"mixed","option":this.completeJobs})
    this.talentQuestionData.unshift({question:{first:"Select the ",second:"system phase you have worked"},"id":5,type:"mixed","option":this.completePhase})
    this.talentQuestionData.unshift({question:{first:"Select your Primary ",second:"software experience"},"id":4,type:"mixed","option":this.completeProduct})
    this.talentQuestionData.unshift({question:{first:"Select the ",second:"module to have specialized"},"id":3,type:"mixed","option":this.datathree})
    this.talentQuestionData.unshift({question:{first:"Select Your Primary Enterprise Application",second:""},"id":2,type:"mixed","option":this.dataKeys})
    this.talentQuestionData.unshift({question:"Professional Summary","id":1,type:"textarea",profileSummary:"",country:{},state:{},city:'',timezone:''})
    this.talentQuestionData.unshift({question:"","id":0,type:"","data":""})
  }

   getDynamicData(){
     this.httpService.get('talentProfile/getTalentProfileSteps').subscribe((response: ApiResponse<any>) => {
      if (response.status) {
        this.rootTalentObject = response
        let dataValues = []; //For values
        for (let key in this.rootTalentObject.talentProfile) {
          dataValues.push(this.rootTalentObject.talentProfile[key]);
          this.dataKeys.push({value:this.rootTalentObject.talentProfile[key]['Primary Domain'],selected:false,disable:false,noOfYear:'',skill:''});
          for (let key2 in this.rootTalentObject.talentProfile[key].Modules) {
            this.datathree.push({value:key2,selected:false,disable:false,noOfYear:'',skill:'',group:this.rootTalentObject.talentProfile[key]['Primary Domain']});
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

  getHeight(){
    if(this.currentPage === 9){
      return 1118;
    }
    else if(this.currentPage === 8){
      return 358;
    }
    else{
      return 377;
    }
  }



  getData(){
    return this.http.get('/assets/talentquestion.json').subscribe( (res:any) =>{
      this.talentQuestionData.push(...res);
      console.log(this.talentQuestionData);
    });
  }

  getDataForSystemPhase(){
    let dataPhase =['Project Planning','Analysis & Requirement','Design','Solution Architecting','Development','Customization','Configuration','Integration','Testing','Devops','Project Management','Support and Maintainence','Dashboard/Reports','Others'];

    dataPhase.forEach((opt:any)=>{
      this.completePhase.push({value:opt,selected:false,disable:false,noOfYear:'',skill:''});
    });


  }


  getCountry(){
    this.httpService.get('location/getCountries').subscribe((response: any) => {
      if(response.status){
        this.countries = response.countries;
      }
    });
  }
  onSelectCountry(opt:any){
    this.talentQuestionData[1].country = this.countries.find((item:any)=>item.code === opt);
    this.selectedCountry = opt;
    this.getState(opt);
  }
  getCity(countryCode:any,stateiso:any){
    const data={
      "countryCode":countryCode,
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
    this.getCity(this.talentQuestionData[1].country.code,opt);
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
  onChoosePDF(event:any){
    this.selectedPDF = event.target.files[0];
    this.uploadPdf();
  }
  uploadPdf(){
    const uploadData = new FormData();
    uploadData.append('talentProfileResume', this.selectedPDF, this.selectedPDF.name);
    uploadData.append('userId',this.sessionService.getLocalStorageCredentials()._id);
    this.httpService.post('talentProfile/setTalentProfileResume',uploadData).subscribe((response: ApiResponse<any>) => {
      if (!response.error) {
        this.toaster.success(`${response.message}`);
        this.resume = this.selectedPDF.name;
      }
    }, (error) => {
      console.log(error);
      this.toaster.error(`${error.message}`);
    });
  }
  onVideoUpload(event:any){
    this.selectedVideoFiles = event.target.files[0];
    console.log(event);
    this.uploadVideo();
  }
  uploadVideo(){
    const uploadData = new FormData();
    uploadData.append('talentProfileVideo', this.selectedVideoFiles, this.selectedVideoFiles.name);
    uploadData.append('userId',this.sessionService.getLocalStorageCredentials()._id);
    this.httpService.post('talentProfile/setTalentProfileVideo',uploadData).subscribe((response: ApiResponse<any>) => {
      if (!response.error) {
        this.toaster.success(`${response.message}`);
        this.selectedVideo = this.selectedVideoFiles.name
      }
    }, (error) => {
      console.log(error);
      this.toaster.error(`${error.message}`);
    });
  }
  onImage(event:any){
    this.selectedImage = event.target.files[0]
    console.log(this.selectedImage);
    this.uploadImage();
  }
  uploadImage(){
    const uploadData = new FormData();
    uploadData.append('talentProfilePhoto', this.selectedImage, this.selectedImage.name);
    uploadData.append('userId',this.sessionService.getLocalStorageCredentials()._id);
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
  changePage(index: number): void {


    this.currentPage += index;
    if(this.currentPage === 8  && this.showProfessionalCodingExperience === false){
      if(index>0){
        this.currentPage = this.currentPage +1;

      }
      else if (index <0){
        this.currentPage = this.currentPage - 1;
      }
 }
    this.width = (this.currentPage / 12) * 100;

    if(this.currentPage === 2 || this.currentPage === 3 || this.currentPage ==4 || this.currentPage === 5 || this.currentPage === 6 || this.currentPage ===8 || this.currentPage === 9 ){
      this.fieldArray=[];
      this.checkAndShowData();
    }
  }

  onUpdateProfile(){
    this.router.navigate(['/Talent-Profile-Edit']);
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


  selectOption(opt: any,type?:any) {
    if(this.currentPage === 1){ // firstQuestion

    }
    else if(this.currentPage === 2){
      opt.selected= true;
      this.enterpriseApplicationGroup = opt.value;
      this.disableOtherValues(opt);
      this.getDataForFieldArray(opt);
    }
    else if( this.currentPage ===3 || this.currentPage ===4 || this.currentPage === 5 || this.currentPage === 6){
      if(this.currentPage === 3){
        this.enterpriseApplicationSubGroup.push(opt.value);
      }
      opt.selected= true;
      opt.disable = true;
      this.getDataForFieldArray(opt);
      if(this.currentPage === 6 && this.getCountForSixQuestion() === 3){
        this.disableOtherValues(opt);
      }
    }
    else if (this.currentPage === 7){
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
    else if( this.currentPage === 8 || this.currentPage ===9){
      opt.selected= true;
      opt.disable = true;
      this.getDataForFieldArray(opt);
    }
    else if (this.currentPage === 10){
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
  if(opt.selected === true && opt.firstPart ==='Actively Looking For Jobs'){
    this.talentQuestionData[this.currentPage].data[1].visible = true;
  }
  else{
    this.talentQuestionData[this.currentPage].data[1].visible = false;
  }
}
    }
    else if (this.currentPage === 11){
      if(opt.type === 'startWorkingWithEasyWork'){
        opt.selected = !opt.selected;
      }
      else if(type === 'preferredPLM'){
        this.preferredPLM = opt;
        this.talentQuestionData[this.currentPage].data.preferredPLM = this.preferredPLM;
      }
      else if(type === 'currentPLM'){
        this.currentPLM = opt;
        this.talentQuestionData[this.currentPage].data.currentPLM = this.currentPLM;
      }
    }
    else if (this.currentPage === 12){

    }
    else if (this.currentPage === 13){
     //to be decide later
    }
  }


  getDataForFieldArray(opt:any){
    this.talentQuestionData[this.currentPage].option.forEach((element:any)=>{
      if(element.selected === true && element.value.toLowerCase() === opt.value.toLowerCase()){
        this.fieldArray.push({value:opt.value,noOfYear:'',skill:''});
        if(this.currentPage === 6){
          this.jobRole.push({value:opt.value,noOfYear:'',skill:''});
        }
      }
});
  }

  disableOtherValues(opt:any){
    if(this.currentPage === 2 || this.currentPage === 6){
      this.talentQuestionData[this.currentPage].option.forEach((element:any)=>{
        element.disable = true;
});
    }
  }

  getCountForSixQuestion(){
    let count =0;
      this.talentQuestionData[this.currentPage].option.forEach((element:any)=>{
        if(element.selected === true){
          count = count + 1;
        }
});
  return count;
}

  deleteFieldValue(option: any) {
    this.sliceItem(option);
  }

  onInputNoOfYear(opt:any){
    if(this.currentPage === 2){
      this.upDateYearInQues2(opt.event,opt.field);
    }
    else if( this.currentPage ===3 || this.currentPage ===4 || this.currentPage === 5 || this.currentPage === 6 || this.currentPage ===8 || this.currentPage === 9) {
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
    else if( this.currentPage ===3 || this.currentPage ===4 || this.currentPage === 5 || this.currentPage === 6 || this.currentPage ===8 || this.currentPage === 9) {
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
        element.disable = false;
        if(element.value.toLowerCase() === field.value.toLowerCase()){
          element.selected = false;
          this.fieldArray = this.fieldArray.filter((item:any) => item.value.toLowerCase() !== field.value.toLowerCase())
        }
  });
  this.disableDependentValuesForPreviousQuestion();
    }
    else if( this.currentPage ===3 || this.currentPage ===4 || this.currentPage === 5 || this.currentPage === 6 || this.currentPage ===8 || this.currentPage === 9) {
      this.talentQuestionData[this.currentPage].option.forEach((element:any)=>{
        if(element.value.toLowerCase() === field.value.toLowerCase()){
          element.selected = false;
          element.disable = false;
          this.fieldArray = this.fieldArray.filter((item:any) => item.value.toLowerCase() !== field.value.toLowerCase());
          if(this.currentPage === 6){
            this.jobRole = this.jobRole.filter((item:any) => item.value.toLowerCase() !== field.value.toLowerCase())
          }
        }
        
        if(this.currentPage === 6 && this.getCountForSixQuestion() <= 3 && element.selected === false){
          element.disable = false;
       }
  });
      if(this.currentPage ===3){
        this.disableNextQuesDependentValue();
      }
    }
  }
  disableDependentValuesForPreviousQuestion(){
    this.talentQuestionData.forEach((data:any)=>{
      if(data.id ===3 || data.id ===4 || data.id ===6 ){
        data.option.forEach((opt:any)=>{
          opt.selected = false;
          opt.disable = false;
          this.enterpriseApplicationGroup='';
          this.enterpriseApplicationSubGroup=[];
        });
      }
    });
  }
  disableNextQuesDependentValue(){
    this.talentQuestionData.forEach((data:any)=>{
      if(data.id ===4 || data.id ===6 ){
        data.option.forEach((opt:any)=>{
          opt.selected = false;
          opt.disable = false;
          this.enterpriseApplicationSubGroup=[];
        });
      }
    });
  }

  onlyNumber(evt:any) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
  enableDisableNextButton(){
    this.disableNextButton = true;
    if(this.currentPage === 1){
      if(this.talentQuestionData[this.currentPage].profileSummary != '' && this.talentQuestionData[this.currentPage].profileSummary.length >200 && this.selectedCity && this.selectedCountry && this.selectedState){
        this.disableNextButton = false;
      }
    }
    else if(this.currentPage === 7){
         if(this.talentQuestionData[this.currentPage].startFreelancing ){
          if(this.talentQuestionData[this.currentPage].option[0].selected === true && this.talentQuestionData[this.currentPage].startWorkingProfessionally ){
            this.disableNextButton = false;
          }
          else if(this.talentQuestionData[this.currentPage].option[1].selected === true){
            this.disableNextButton = false;
          }
         }
    }
    else if (this.currentPage===2 || this.currentPage === 3|| this.currentPage === 4 || this.currentPage === 5 || this.currentPage ===6  || this.currentPage ===8 || this.currentPage === 9 ){
     this.fieldArray.forEach((element:any)=>{
      if(element.value && element.noOfYear && element.expertise){
           this.disableNextButton = false;
      }
      else{
        this.disableNextButton = true;
      }
      });
    }
    else if(this.currentPage === 10){
      this.disableNextButton = false;
    }
    else if(this.currentPage === 11){
     this.disableNextButton = this.getButtonEnableForElev();
    }
    else if(this.currentPage === 12){
      this.disableNextButton = false;
    }
    else if(this.currentPage === 13){
      this.disableNextButton = this.getButtonEnableForQue13();
    }
  }

  getButtonEnableForElev(){
    let opt = this.talentQuestionData[this.currentPage];
    if(opt.data.desiredHourlyrate && opt.data.targetAnnualSalary && opt.data.monthlyRate && opt.data.selectedPLM && opt.data.weeklyHourlyRate && this.getButtonEnableForMultiSelect(opt.startWorkingWithEasyWork)){
      return false;
    }
    else{
      return true;
    }
  }

  getButtonEnableForQue13(){
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
        this.router.navigate(['/Talent-Profile-Edit']);
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
