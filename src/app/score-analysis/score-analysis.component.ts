import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-score-analysis',
  templateUrl: './score-analysis.component.html',
  styleUrls: ['./score-analysis.component.css']
})
export class ScoreAnalysisComponent implements OnInit {
  public canvasWidth = 220;
  public needleValue = 65;
  public centralLabel = '';
  public name = '';
  public bottomLabel = '65%';
  public options = {
      hasNeedle: true,
      needleColor: 'black',
      needleUpdateSpeed: 1000,
      arcColors: ['rgb(255,84,84)', 'rgb(239,214,19)', 'rgb(61,204,91)'],
      arcDelimiters: [40, 60],
      rangeLabel: ['0', '100'],
      needleStartValue: 50,
  };
  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  onFeedback(){
    this.router.navigate(['/feedback']);
  }

}
