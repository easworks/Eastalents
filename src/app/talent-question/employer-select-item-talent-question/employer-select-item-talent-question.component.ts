import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
@Component({
  selector: 'app-employer-select-item-talent-question',
  templateUrl: './employer-select-item-talent-question.component.html',
  styleUrls: ['./employer-select-item-talent-question.component.css']
})
export class EmployerSelectItemTalentQuestionComponent implements OnInit {
  @Input() fieldArray: Array<any> = [];
  @Output() deleteFieldValue = new EventEmitter<any>();
  constructor() { }
  ngOnInit(): void {
  }
  deleteOption(index: any, option: any) {
    this.deleteFieldValue.emit(option);
  }

}
