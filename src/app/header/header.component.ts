import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { HomeService } from "../_services/home.service";
import * as _ from 'lodash';

declare var $: any;

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: [],
})
export class HeaderComponent implements OnInit {
  public primaryDomains: any;
  public softwate: any;
  public softwareList: any;
  public homeJobDetails: any;
  public homeDetails: any;
  public sideNavList: any = [];
  public subNavlist: any = [];
  public searchText: any;
  public selectedProduct: any;
  constructor(public HomeService: HomeService, public router: Router) { 
  }
  @Output() eventForSwitchTenant = new EventEmitter();

  ngOnInit(): void {
    $(document).ready(function () {
      $('.sidemenu').click(function () {
        $('.sideWrapper').show();
        $('.overlay').show();
        $('body').addClass('overflow-hidden');
      });
      $('.closebtn').click(function () {
        $('.sideWrapper').hide();
        $('.overlay').hide();
        $('body').removeClass('overflow-hidden');
      });

      $('#togglebutton').click(function () {
        $('.nav-menu').show();
      });
      $('.toggle-closebtn').click(function () {
        $('.nav-menu').hide();
      });
    });





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
            profiles['Product'].splice(7, 0, { "name": `Custom ${profiles['prefix']} / Legacy Application`, imageUrl: "Custom" })
            profiles['show'] = true;
            profiles['selected'] = false;
            profiles['limit'] = 10;
            talentprofile.push(profiles);
          }
          if (i == prefix_suffix.length - 1) {
            this.softwareList = this.primaryDomains[0]['softwate'];
            console.log(this.softwareList);
            console.log(this.primaryDomains);
            console.log(talentprofile);
            this.sideNavList = talentprofile;
            this.sideNavList[0]['selected'] = true;
            this.subNavlist = this.sideNavList[0].Product;
            this.selectedProduct = this.sideNavList[0];
          }
        })
      })
    }, err => {
      this.homeDetails = [];
      console.log(err);
    })
  }

  goToUseCase(value: any) {
    sessionStorage.setItem("useCaseName", value);
    this.router.navigate(['/useCase', value]);
    this.eventForSwitchTenant.emit('');
  }

  selectDomain(idx: any) {
    this.sideNavList.map((e: any, i: number) => {
      e['selected'] = false;
      if (i == this.sideNavList.length - 1) {
        this.sideNavList[idx]['selected'] = true;
        this.subNavlist = this.sideNavList[idx].Product;
        this.selectedProduct = this.sideNavList[idx];
      }
    })
  }


  goToRoles(productObj: any) {
    this.selectedProduct['Product'] = productObj;
    sessionStorage.setItem("prd", JSON.stringify(this.selectedProduct));
    sessionStorage.setItem("software", JSON.stringify(this.softwate));
    sessionStorage.setItem("domain", JSON.stringify(this.primaryDomains));
    this.router.navigate(['/AEroles']);
    $('.sideWrapper').hide();
    $('.overlay').hide();
    $('body').removeClass('overflow-hidden');
  }

}
