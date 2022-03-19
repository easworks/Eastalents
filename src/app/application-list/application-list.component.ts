import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: []
})
export class ApplicationListComponent implements OnInit {
  public role: any = sessionStorage.getItem("role");
  public software: any = sessionStorage.getItem("software");
  public domains: any = sessionStorage.getItem("domain");
  public softwareList: any = [];
  constructor() {
    this.role = JSON.parse(this.role);
    this.software = JSON.parse(this.software);
    this.domains = JSON.parse(this.domains);
    this.softwareList = this.domains[0]['softwate'];
    window.scrollTo(0,0);
  }

  ngOnInit(): void {
  }

  changeDomain(list: any) {
    this.softwareList = this.software[list.value]
  }
}
