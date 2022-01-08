import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-talent-question-dynamic',
  templateUrl: './talent-question-dynamic.component.html',
  styleUrls: []
})
export class TalentQuestionDynamicComponent implements OnInit {

  @Input() currentPage: any;
  @Input() talentOption: any;
  @Output() nextPage = new EventEmitter<string>();
  @Output() sliceItem = new EventEmitter<string>();


  public fieldArray: Array<any> = [];
  constructor() { }

  ngOnInit(): void {
  }

  selectOption(option: string) {
    this.fieldArray.push(option);
    this.nextPage.emit(option);
  }

  deleteFieldValue(index: any, option: string) {
    this.fieldArray.splice(index, 1);
    this.sliceItem.emit(option);

  }
}