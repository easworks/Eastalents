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
    this.inputNoOfYear.emit({event:event,field:field});
  }
  onInputSkill(event:any,field:any){
    this.inputNoOfSkill.emit({event:event,field:field});
  }
 

}
