import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { element } from 'protractor';

@Component({
  selector: 'app-emploer-question',
  templateUrl: './emploer-question.component.html',
  styleUrls: []
})
export class EmploerQuestionComponent implements OnInit {

  constructor( private http: HttpClient,private ref: ChangeDetectorRef) { }
  currentIndex:number =0;
  fieldArray:any=[];
  answers:any=[];
  employeeQuestionData:any=[];
  public width = 0;
  type={
    select:"select",
    textarea:"textarea",
    mixed:"mixed"
  }
  firstOption=false;

  ngOnInit(): void {
    this.getData();
    console.log(this.currentIndex);
    this.answers[this.currentIndex]={name:'GET started'};
  }

  onChange(index:number){
    this.currentIndex += index;
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
    else if(this.type.mixed === questionType){
       this.fieldArray = [];
       this.checkAndShowData();
    }

  }

  getType():string{
  if(this.currentIndex ===1 ||this.currentIndex ===2 ||this.currentIndex ===11 ||this.currentIndex ===14 ||this.currentIndex ===15 ){
    return 'mixed';
  }
  else if (this.currentIndex === 4 ||this.currentIndex ===9){
    return 'textarea';
  }
  else{
    return 'select';
  }
  }

  checkAndShowData(){
    this.employeeQuestionData[this.currentIndex].option.forEach((element:any)=>{
      if(element.selected=== true && element.disable=== true){
        this.fieldArray.push(element);
      }
    });
  }
  getData(){
    return this.http.get('/assets/employerquestion.json').subscribe(res =>{
      this.employeeQuestionData = res;
      console.log(this.employeeQuestionData[0].type);
    });
  }
  deleteOption(i:any,field:any){
    this.employeeQuestionData[this.currentIndex].option.forEach((element:any)=>{
      if(element.value.toLowerCase() === field.value.toLowerCase()){
        element.selected = false;
        element.disable = false;
        this.fieldArray = this.fieldArray.filter((item:any) => item.value.toLowerCase() !== field.value.toLowerCase())
      }
});
  }
  selectOption(opt:any,type:string){
    if(type === 'mixed'){
        opt.selected= true;
        opt.disable = true;
        this.getDataForFieldArray(opt);
    }
    else if (type === 'textarea'){
     //do nothing
    }
    else if (type === 'select'){
      opt.selected = !opt.selected;
      this.disableOtherValues(opt);

    }
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
  onInputNoOfYear(value:any,field:any){
    // console.log(event);
    this.ref.detectChanges();
    this.upDateYearInMixedType(value,field);
  }
  onInputSkill(value:any,field:any){
    // console.log(event);
    this.ref.detectChanges();
    this.upDateSkillInMixedType(value,field);
  }

  upDateYearInMixedType(value:any,completeData:any){
    this.employeeQuestionData[this.currentIndex].option.forEach((element:any)=>{
             if(completeData.value.toLowerCase() === element.value.toLowerCase() && element.selected === true && element.disable ===true){
               element.noOfYear = value;
              //  completeData.noOfYear = value;
             }
          });

   this.fieldArray.forEach((element:any)=>{
     if(element.value.toLowerCase() === completeData.value.toLowerCase() ){
          element.noOfYear = value;
     }
   });
  }

  upDateSkillInMixedType(value:any,completeData:any){
    this.employeeQuestionData[this.currentIndex].option.forEach((element:any)=>{
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

  goToMyProfile(){
    console.log(this.employeeQuestionData);
  }

}
