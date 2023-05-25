import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../_services/http.service';
import { SessionService } from '../_services/session.service';

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
  countries:any;
  constructor(private router:Router,private http: HttpClient,private httpService: HttpService,private sessionService: SessionService) { }

  ngOnInit(): void {
    let data:any={
      userId: this.sessionService.getLocalStorageCredentials()._id,
    }
    this.httpService.post('questions/getUserTests',data).subscribe((response: any) => {
      if(response.status){
        this.countries = response.countries;
      }
    });
  }

  onFeedback(){
    this.router.navigate(['/feedback']);
  }
  

}
