import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ae-roles',
  templateUrl: './ae-roles.component.html',
  styleUrls: []
})
export class AeRolesComponent implements OnInit {
  public show: boolean = true;
  public prd: any = sessionStorage.getItem("prd");
  public software: any = sessionStorage.getItem("software");
  public domains: any = sessionStorage.getItem("domain");
  public domainValue: any;
  public softwareList: any = [];
  constructor() {
    this.prd = JSON.parse(this.prd);
    this.software = JSON.parse(this.software);
    this.domains = JSON.parse(this.domains);
    this.softwareList = this.domains[0]['softwate'];
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {
  }

  changeDomain(list: any) {
    this.softwareList = this.software[list.value]
  }

  showMore(){
    this.show = !this.show;
    if(this.show){
      window.scrollTo(0, 0);
    }
  }
}
