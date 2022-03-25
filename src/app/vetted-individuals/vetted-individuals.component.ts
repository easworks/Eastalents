import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vetted-individuals',
  templateUrl: './vetted-individuals.component.html',
  styleUrls: ['./vetted-individuals.component.scss']
})
export class VettedIndividualsComponent implements OnInit {
  public vettedIndividuals: any = sessionStorage.getItem("vettedIndividuals");
  vettedIndividualsPageDetails: any;
  constructor() {
    this.vettedIndividuals = JSON.parse(this.vettedIndividuals);
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {
  }

}
