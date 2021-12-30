import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-talent-question-dynamic',
  templateUrl: './talent-question-dynamic.component.html',
  styleUrls: []
})
export class TalentQuestionDynamicComponent implements OnInit {

  @Input() currentPage:any;

  constructor() { }
  ngOnInit(): void {
  }
}