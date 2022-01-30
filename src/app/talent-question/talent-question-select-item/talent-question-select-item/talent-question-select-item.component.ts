import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-talent-question-select-item',
  templateUrl: './talent-question-select-item.component.html',
  styleUrls: ['./talent-question-select-item.component.css']
})
export class TalentQuestionSelectItemComponent implements OnInit {

  @Input() fieldArray: Array<any> = [];
  @Input() isSingleControl: Boolean = false;

  @Output() deleteFieldValue = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  deleteOption(index: any, option: any) {
    this.deleteFieldValue.emit(option);
  }

}
