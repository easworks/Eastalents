import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-talent-question-select-item',
  templateUrl: './talent-question-select-item.component.html',
  styleUrls: ['./talent-question-select-item.component.css']
})
export class TalentQuestionSelectItemComponent implements OnInit {

  @Input() fieldArray: Array<any> = [];
  // @Input() savePreviousData: Array<any> = [];
  // @Input() isSingleControl: Boolean = false;

  @Output() deleteFieldValue = new EventEmitter<any>();
  // @Output() outputData = new EventEmitter<any>();
  @Output() inputNoOfYear = new EventEmitter<any>();
  @Output() inputNoOfSkill = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  deleteOption(index: any, option: any) {
    this.deleteFieldValue.emit(option);
  }

  onInputNoOfYear(event:any,field:any){
    // if(this.getData(event)){
    //    event.preventDefault();
    // }
    this.inputNoOfYear.emit({event:event,field:field});
  }
  onInputSkill(event:any,field:any){
    this.inputNoOfSkill.emit({event:event,field:field});
  }
  onlyNumber(evt:any) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

// getData(opt:any){
//   let data = ['0','1','2','3','4','5','6','7','8','9'];
//   for(var i=0;i<opt.length;i++){
//     if(!data.includes(opt[i])){
//          return false;
//     }
//   }
//   return true;
// }
 

}
