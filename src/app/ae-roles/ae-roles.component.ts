import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  public domainInput: any;
  constructor(private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.prd = JSON.parse(this.prd);
    this.software = JSON.parse(this.software);
    this.domains = JSON.parse(this.domains);
    this.domainInput = this.prd['name'];

    this.domains.map((e: any) => {
      if (e.domain == this.prd['name']) {
        this.softwareList = e['softwate'];
      }
    })
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {
  }

  changeDomain(list: any) {
    this.softwareList = this.software[list.value]
  }

  showMore() {
    this.show = !this.show;
    if (this.show) {
      window.scrollTo(0, 0);
    }
  }
}
