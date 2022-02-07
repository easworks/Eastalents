import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from '../_models';
import { HttpService } from '../_services/http.service';
import { SessionService } from '../_services/session.service';
import { ToasterService } from '../_services/toaster.service';

@Component({
  selector: 'app-talent-profile-view',
  templateUrl: './talent-profile-view.component.html',
  styleUrls: []
})
export class TalentProfileViewComponent implements OnInit {

  constructor(private sessionService: SessionService,private httpService: HttpService,
    private router: Router,private toaster:ToasterService) { }
  name:any={}
  talentProfile:any;
  userId:string='';
  data:any={

  }
  rateValue:any={};


  ngOnInit(): void {
    this.name.firstName = this.sessionService.getLocalStorageCredentials().firstName;
    this.name.lastName = this.sessionService.getLocalStorageCredentials().lastName;
    this.userId= this.sessionService.getLocalStorageCredentials()._id,
    // this.data.userId = this.userId;
    // this.data=JSON.stringify(this.data);
    this.httpService.post('talentProfile/getTalentProfile',{userId:this.userId}).subscribe((response) => {
      if (response.status) {
        this.talentProfile = response.steps;
        this.rateValue = this.talentProfile.stepObject[30].optionObj[0];
        // this.toaster.success(`${response.message}`);
      }
    }, (error) => {
      this.toaster.error(`${error.message}`);
      console.log(error);
    });

  }

  

  takeTest(){
    this.router.navigate(['/question-category']);
  }

}
