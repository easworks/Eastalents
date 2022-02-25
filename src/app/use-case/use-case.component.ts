import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';

import usecase from '../../assets/localDB/useCase.json';
var usecaseJson: any = usecase;
@Component({
  selector: 'app-use-case',
  templateUrl: './use-case.component.html',
  styleUrls: ['./use-case.component.css']
})
export class UseCaseComponent implements OnInit, AfterViewInit {

  public useCaseValue: any = sessionStorage.getItem("useCaseName");
  public test = "../../assets/packages/f20_ureyqxyw.json";
  public useCaseDetails: any;
  constructor() {
    this.useCaseDetails = usecaseJson[this.useCaseValue]
    // this.test = "assets/packages/lf20_ureyqxyw.json"
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  dashboardEvent: Subject<any> = new Subject();
  public loadContent: boolean = true;
  getSwitchTenantEvent(data: any) {
    this.loadContent = false;
    this.useCaseValue = sessionStorage.getItem("useCaseName")
    setTimeout(() => {
      this.useCaseDetails = usecaseJson[this.useCaseValue];
      this.loadContent = true;
    }, 0);
  }


}
