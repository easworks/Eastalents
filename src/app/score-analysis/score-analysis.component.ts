import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-score-analysis',
  templateUrl: './score-analysis.component.html',
  styleUrls: ['./score-analysis.component.css']
})
export class ScoreAnalysisComponent implements OnInit {
  public canvasWidth = 300;
  public needleValue = 65;
  public centralLabel = '';
  public name = '';
  public bottomLabel = '65 %';
  public options = {
      hasNeedle: true,
      needleColor: 'black',
      needleUpdateSpeed: 1000,
      arcColors: ['rgb(255,84,84)', 'rgb(239,214,19)', 'rgb(61,204,91)'],
      arcDelimiters: [40, 60],
      rangeLabel: ['0', '100'],
      needleStartValue: 50,
  };
  constructor() { }

  ngOnInit(): void {
  }

}
