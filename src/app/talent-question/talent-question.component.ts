import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-talent-question',
  templateUrl: './talent-question.component.html',
  styleUrls: []
})
export class TalentQuestionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public currentPage = 0;
  public width = 0;
  public changePage(index: number): void {
    this.currentPage += index;
    this.width = (this.currentPage / 33) * 100;
  }

}
