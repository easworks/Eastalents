import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-employer-select-item',
  templateUrl: './employer-select-item.component.html',
  styleUrls: ['./employer-select-item.component.css']
})
export class EmployerSelectItemComponent implements OnInit {

  @Input() fieldArray: Array<any> = [];
  // @Input() savePreviousData: Array<any> = [];
  // @Input() isSingleControl: Boolean = false;

  @Output() deleteFieldValue = new EventEmitter<any>();
  // @Output() outputData = new EventEmitter<any>();
  // @Output() inputNoOfYear = new EventEmitter<any>();
  // @Output() inputNoOfSkill = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  deleteOption(index: any, option: any) {
    this.deleteFieldValue.emit(option);
  }

  // onInputNoOfYear(event:any,field:any){
  //   this.inputNoOfYear.emit({event:event,field:field});
  // }
  // onInputSkill(event:any,field:any){
  //   this.inputNoOfSkill.emit({event:event,field:field});
  // }

}
