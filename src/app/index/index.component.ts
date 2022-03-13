import { Component, OnInit } from '@angular/core';
import { HomeService } from '../_services/home.service';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';
import { Router } from '@angular/router';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  show: boolean = false;
  public imageBaseUrl = `${environment.imageUrl}`;
  productColorList = ['colorafedec', 'colorb4c0ea', 'colorfec1ae', 'colore9b0e5', 'colorffdaad', 'color97c996', 'colorafedec']
  public homeDetails: any = []
  public applicationRoles: any = [];
  public temp: any = [];
  public homeJobDetails: any;
  public primaryDomains: any;
  public softwate: any;
  constructor(public HomeService: HomeService, public router: Router) { }
  ngOnInit(): void {
    this.HomeService.getTalentProfileSteps('talentProfile/getTalentProfileSteps').subscribe(res => {
      let response: any = res['talentProfile'];
      this.primaryDomains = [];
      let domainName: any = {}
      this.softwate;
      this.homeJobDetails = res['talentProfile'];
      let prefix_suffix = [];
      prefix_suffix = Object.keys(response)
      let talentprofile: any = [];
      prefix_suffix.map((e, i) => {
        let profiles: any = {};
        profiles['prefix'] = e;
        profiles['name'] = response[e]["Primary Domain"];
        let moduleArray = Object.keys(response[e]["Modules"])
        profiles['Job_Roles'] = [];
        profiles['Product'] = [];
        moduleArray.map((j, idx) => {
          profiles['Job_Roles'] = [...profiles['Job_Roles'], ...response[e]["Modules"][j]["Job roles"]]
          profiles['Product'] = [...profiles['Product'], ...response[e]["Modules"][j]["Product"]]
          if (idx == moduleArray.length - 1) {
            domainName[profiles['name']] = profiles['Product'];
            this.softwate = domainName;
            profiles['Job_Roles'] = _.uniq(profiles['Job_Roles']).sort();
            profiles['Product'] = _.uniq(profiles['Product']);
            profiles['Product'] = _.filter(profiles['Product'], function (o) { return o.imageUrl != ""; });
            profiles['Job_Roles'] = _.filter(profiles['Job_Roles'], function (o) { return o != ""; });
            this.primaryDomains.push({ "domain": profiles['name'], "softwate": profiles['Product'] })
            moduleArray.unshift("All");
            profiles['moduleArray'] = moduleArray;
            profiles['Product'].splice(7, 0, { "name": `Custom ${profiles['prefix']} / Legacy Application`, imageUrl: "Custom", "color": this.productColorList[Math.floor(Math.random() * this.productColorList.length)] })
            talentprofile.push(profiles);
            this.homeDetails = JSON.parse(JSON.stringify(talentprofile));
            this.applicationRoles = talentprofile;
          }
        })
      })
    }, err => {
      this.homeDetails = [];
      console.log(err);
    })
  }

  setColor(value: any) {
    if (value == 'Custom') {
      return true;
    } else {
      return false;
    }
  }

  changeFilter(i: any, target: any) {
    if (target['value'] == "All") {
      this.applicationRoles[i]['Job_Roles'] = [];
      this.applicationRoles[i]['Job_Roles'] = this.homeDetails[i]['Job_Roles'];
    } else {
      this.applicationRoles[i]['Job_Roles'] = [];
      this.applicationRoles[i]['Job_Roles'] = _.uniq(_.filter(this.homeJobDetails[this.applicationRoles[i]['prefix']]['Modules'][target['value']]['Job roles'], function (o) { return o != ""; })).sort();
    }
  }

  goToRoles(prd: any, productObj: any) {
    prd['Product'] = productObj;
    console.log(this.primaryDomains);
    sessionStorage.setItem("prd", JSON.stringify(prd));
    sessionStorage.setItem("software", JSON.stringify(this.softwate));
    sessionStorage.setItem("domain", JSON.stringify(this.primaryDomains));
    this.router.navigate(['/AEroles'])
  }
}