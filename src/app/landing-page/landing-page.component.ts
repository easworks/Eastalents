import { Component, OnInit } from '@angular/core';
import entToend from '../../assets/localDB/e2e.json';
var entToendJson: any = entToend;

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: []
})
export class LandingPageComponent implements OnInit {
  public entToendJson: any = entToendJson;

  constructor() { }

  ngOnInit(): void {
  }

}
