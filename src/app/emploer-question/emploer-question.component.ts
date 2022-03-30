import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../_services/http.service';

@Component({
  selector: 'app-emploer-question',
  templateUrl: './emploer-question.component.html',
  styleUrls: []
})
export class EmploerQuestionComponent implements OnInit {

  constructor( private http: HttpClient,private ref: ChangeDetectorRef,private router: Router,private httpService: HttpService) { }
  currentIndex:number =0;
  fieldArray:any=[];
  answers:any=[];
  employeeQuestionData:any=[];
  public width = 0;
  type={
    select:"select",
    textarea:"textarea",
    selectBox:"selectBox",
    multiselect:"multiselect",
    techquestion:"techquestion",
    selectYesNo:"selectYesNo",
  }
  firstOption=false;
  disableNextButton:boolean = true;
  filterString:any='';
  buttonDataFilter='';
  enterpriseApplicationGroup='';
  showTechQuestion:boolean = false;

  ngOnInit(): void {
    // this.getData();
    console.log(this.currentIndex);
    this.answers[this.currentIndex]={name:'GET started'};
    this.httpService.get('employerProfile/getEmployerProfileSteps').subscribe((response: any) => {
      if (response.status) {
        // this.rootTalentObject = response
        this.employeeQuestionData = response.employerProfile;
        console.log(this.employeeQuestionData);
      }
    }, (error) => {
      console.log(error);
    });
  }

  onChange(index:number){
    this.currentIndex += index;
    if(this.currentIndex === 5  && this.showTechQuestion === false){
      if(index>0){
        this.currentIndex = this.currentIndex +1;

      }
      else if (index <0){
        this.currentIndex = this.currentIndex - 1;
      }
 }
    this.width = (this.currentIndex / 15) * 100;
    if(this.currentIndex === 1){
      this.firstOption = true;
    }
    console.log(this.currentIndex);
    console.log(this.answers);
    const questionType = this.getType();
    if(this.type.select === questionType){
         //Do nothing
    }
    else if(this.type.selectBox === questionType || this.type.techquestion === questionType){
       this.fieldArray = [];
       this.checkAndShowData();
    }
    // this.enableDisableNextButton();

  }

  getType():string{
  if(this.currentIndex ===1 ||this.currentIndex ===2 ||this.currentIndex ===3){
    return 'selectBox';
  }
  else if (this.currentIndex === 5){
    return 'techquestion';
  }
  else if (this.currentIndex === 11){
    return 'multiselect';
  }
  else if (this.currentIndex === 4 ){
    return 'selectYesNo';
  }
  else if (this.currentIndex === 13){
    return 'resumequestion';
  }
  else{
    return 'select';
  }
  }

  buttonData(opt:any){
  this.buttonDataFilter = opt.value;
  }

  checkAndShowData(){
    this.employeeQuestionData[this.currentIndex].option.forEach((element:any)=>{
      if(element.selected=== true ){
        this.fieldArray.push(element);
      }
    });
  }
  // getData(){
  //   return this.http.get('/assets/employerquestion.json').subscribe(res =>{
  //     this.employeeQuestionData = res;
  //     console.log(this.employeeQuestionData[0].type);
  //   });
  // }
  deleteSelectedOption(field:any){
    this.employeeQuestionData[this.currentIndex].option.forEach((element:any)=>{
      if(element.value.toLowerCase() === field.value.toLowerCase()){
        element.selected = false;
        element.disable = false;
        this.fieldArray = this.fieldArray.filter((item:any) => item.value.toLowerCase() !== field.value.toLowerCase())
      }
});
// this.enableDisableNextButton();
  }
  selectOption(opt:any,type:string){
    if(type === 'selectBox' || type === 'techquestion'){
        opt.selected= true;
        opt.disable = true;
        if(this.currentIndex === 1){
          this.enterpriseApplicationGroup = opt.value;
        this.employeeQuestionData[this.currentIndex].option.forEach((option:any)=>{
            option.disable = true;
        });
        }
        this.getDataForFieldArray(opt);
    }
    else if (type === 'selectYesNo'){
       opt.selected = !opt.selected;
       this.showOrHideTechQuestion(opt);
       this.disableOtherValues(opt);

    }
    else if (type === 'select'){
      opt.selected = !opt.selected;
      this.disableOtherValues(opt);
      
    }
    else if (type === 'multiselect'){
      opt.selected = !opt.selected;
      // this.disableOtherValues(opt);
      
      
    }
    else if (type === 'resumequestion'){
      // opt.selected = !opt.selected;
      // this.disableOtherValues(opt);
      
    }
    // this.enableDisableNextButton();
  }
  getDataForFieldArray(opt:any){
    this.employeeQuestionData[this.currentIndex].option.forEach((element:any)=>{
      if(element.selected === true && element.value.toLowerCase() === opt.value.toLowerCase()){
        this.fieldArray.push({value:opt.value,noOfYear:'',skill:''});
      }
});
  }

  disableOtherValues(opt:any){
    this.employeeQuestionData[this.currentIndex].option.forEach((element:any)=>{
      if(opt.selected === true && opt.value != element.value ){
        element.disable = true;
      }
      else if(opt.selected === false){
        element.disable = false;
      }
});
  }

  showOrHideTechQuestion(opt:any){
    this.showTechQuestion = false;
    this.employeeQuestionData[this.currentIndex].option.forEach((element:any)=>{
      if(element.selected === true && opt.value.toLowerCase() === 'yes'){
        this.showTechQuestion = true;
      }
});
  }
  // onInputNoOfYear(opt:any){
    
  //   // console.log(event);
  //   // this.ref.detectChanges();
  //   this.upDateYearInMixedType(opt.event,opt.field);
  //   // this.enableDisableNextButton();
  // }
  // onInputSkill(opt:any){
  //   // console.log(event);
  //   // this.ref.detectChanges();
  //   this.upDateSkillInMixedType(opt.event,opt.field);
  //   // this.enableDisableNextButton();
  // }

  // upDateYearInMixedType(value:any,completeData:any){
  //   this.employeeQuestionData[this.currentIndex].option.forEach((element:any)=>{
  //            if(completeData.value.toLowerCase() === element.value.toLowerCase() && element.selected === true && element.disable ===true){
  //              element.noOfYear = value;
  //             //  completeData.noOfYear = value;
  //            }
  //         });

  //  this.fieldArray.forEach((element:any)=>{
  //    if(element.value.toLowerCase() === completeData.value.toLowerCase() ){
  //         element.noOfYear = value;
  //    }
  //  });
  // }

  // upDateSkillInMixedType(value:any,completeData:any){
  //   this.employeeQuestionData[this.currentIndex].option.forEach((element:any)=>{
  //            if(completeData.value.toLowerCase() === element.value.toLowerCase()  && element.selected === true && element.disable === true){
  //              element.skill = value;
  //             //  completeData.skill = value;
  //            }
  //         });

  //         this.fieldArray.forEach((element:any)=>{
  //           if(element.value.toLowerCase() === completeData.value.toLowerCase() ){
  //                element.skill = value;
  //           }
  //         });
  // }


  enableDisableNextButton(){
    this.disableNextButton = true;
    let checkVariableForMixed = false;
    const questionType = this.getType();
    if(this.type.select === questionType){
      this.employeeQuestionData[this.currentIndex].option.forEach((element:any)=>{
        if(element.selected=== true && element.disable=== false){
          this.disableNextButton = false;
        }
      });
    }
    else if(this.type.selectBox === questionType){
      this.fieldArray.forEach((element:any)=>{
        if(element.value != '' && element.noOfYear != '' &&  element.skill != ''){
             checkVariableForMixed = true;
        }
        else{
          checkVariableForMixed = false;
        }
      });
      this.disableNextButton = !checkVariableForMixed;
      
    }
    else if(this.type.textarea === questionType){
      if(this.employeeQuestionData[this.currentIndex].value != '' && this.employeeQuestionData[this.currentIndex].value.length>=200 ){
        this.disableNextButton = false;
      }
    }
    else if(this.type.multiselect === questionType){
     for(var i= 0;i<this.employeeQuestionData[this.currentIndex].option.length;i++){
       if(this.employeeQuestionData[this.currentIndex].option[i].selected === true){
         this.disableNextButton = false;
       }
     }
    }
  }
  goToMyProfile(){
    this.router.navigate(['/employer-profile']);
    console.log(this.employeeQuestionData);
  }

}
