import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-talent-question-dynamic',
  templateUrl: './talent-question-dynamic.component.html',
  styleUrls: []
})
export class TalentQuestionDynamicComponent implements OnInit {

  @Input() talentOption: any;
  @Input() fieldArray: Array<any> = [];
  @Input() currentPage: number = 0;
  @Output() nextPage = new EventEmitter<string>();
  @Output() sliceItem = new EventEmitter<string>();

  constructor(
  ) { }

  ngOnInit(): void {
  }

  selectOption(option: string) {
    this.nextPage.emit(option);
  }

  deleteFieldValue(option: string) {
    this.sliceItem.emit(option);
  }

  getQuestion() {
    if (this.currentPage == 2)
      return "Select your Primary Enterprise Application";
    if (this.currentPage == 3)
      return " Select your Primary Enterprise Application Software Experience";
    if (this.currentPage == 4)
      return " Select your specialization area";
    if (this.currentPage == 5)
      return "Select your Primary Role";
    return "";
  }

}