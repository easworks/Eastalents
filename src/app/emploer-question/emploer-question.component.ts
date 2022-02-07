import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-emploer-question',
  templateUrl: './emploer-question.component.html',
  styleUrls: []
})
export class EmploerQuestionComponent implements OnInit {

  constructor( private http: HttpClient) { }
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
         
    }
    else if(this.type.mixed === questionType){
       this.fieldArray = [];
       this.checkAndShowData();
    }

  }

  getType():string{
  if(this.currentIndex ===1){
    return 'mixed';
  }
  else if (this.currentIndex === 4 ){
    return 'select';
  }
  else{
    return 'textarea';
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
        this.fieldArray.push({value:opt.value,noOfYear:'',expertise:''});
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
  retrieveData(){
  //   this.fieldArray=[];
  //   if(this.type.mixed=== 'mixed' && this.answers[this.currentIndex].length){
  //     this.answers[this.currentIndex].forEach((data:any )=>{
  //       this.fieldArray.push(data);
  //   });
  // }
  }
  goToMyProfile(){
    
  }

}
