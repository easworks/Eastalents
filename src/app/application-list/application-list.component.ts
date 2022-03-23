import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

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
  public imageBaseUrl = `${environment.imageUrl}`;
  public domainInput: any;
  public showMore: boolean = true;
  constructor() {
    this.role = JSON.parse(this.role);
    this.software = JSON.parse(this.software);
    this.domains = JSON.parse(this.domains); 
    window.scrollTo(0, 0);
    this.domainInput = this.role['name'];
    this.domains.map((e: any) => {
      if (e.domain == this.role['name']) {
        this.softwareList = e['softwate'];
      }
    }) 
  }

  ngOnInit(): void {
  }

  changeDomain(list: any) {
    this.softwareList = this.software[list.value]
  }
}
