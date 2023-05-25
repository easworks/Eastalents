import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from '../_models';
import { HttpService } from '../_services/http.service';
import { SessionService } from '../_services/session.service';
import { ToasterService } from '../_services/toaster.service';

@Component({
  selector: 'app-question-section',
  templateUrl: './question-section.component.html',
  styleUrls: ['./question-section.component.css']
})
export class QuestionSectionComponent implements OnInit {

  constructor(private sessionService: SessionService,private httpService: HttpService,
    private router: Router,private toaster:ToasterService) { }
  name:any={}
  talentProfile:any;
  userId:string='';

  ngOnInit(): void {
    this.userId= this.sessionService.getLocalStorageCredentials()._id,
    // this.data.userId = this.userId;
    // this.data=JSON.stringify(this.data);
    this.httpService.post('questions/getUserTests',{userId:this.userId}).subscribe((response: ApiResponse<any>) => {
      if (response.status) {
        this.talentProfile = response;
        this.toaster.success(`${response.message}`);
      }
    }, (error) => {
      this.toaster.error(`${error.message}`);
      console.log(error);
    });
  }

  onStartTest(){
    this.router.navigate(['/talentquizquestion']);
  }

}
