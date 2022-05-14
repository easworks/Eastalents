import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../_services/http.service';
import { SessionService } from '../_services/session.service';
import { ToasterService } from '../_services/toaster.service';

@Component({
  selector: 'app-employer-profile',
  templateUrl: './employer-profile.component.html',
  styleUrls: ['./employer-profile.component.css']
})
export class EmployerProfileComponent implements OnInit {

  constructor( private toaster: ToasterService,private sessionService: SessionService,private httpService: HttpService,
    private router: Router) { }

  employerQuestionData:any;
  groups:any=[];
  randomTechData:any=[];

  ngOnInit(): void {
    this.getEmployerProfile();
  }

  getEmployerProfile(){
    let data:any={
      userId: this.sessionService.getLocalStorageCredentials()._id
    }
    this.httpService.post('employerProfile/getEmployerProfile',data).subscribe((response:any) => {
      if (!response.error) {
        this.toaster.success(`${response.message}`);
        this.employerQuestionData = response.steps;
        this.formatData();
      }
    }, (error) => {
      this.toaster.error(`${error.message}`);
    });
  }

  formatData(){
    let arrData=[];
    const list = this.employerQuestionData[5].button.map( (i:any) => i.value);
   this.groups= list.map( (c:any) => { 
            return  { group:c, option:[]};
        } ); 

  
    this.groups.forEach((data:any)=>{
      arrData = this.employerQuestionData[5].option.filter((item:any) => item.group === data.group && item.selected === true);
      data.option.push(...arrData);
});
  

  console.log(list);
  console.log(this.groups);
  this.RandomCollectData();
  // this.saveRequiredData();
      }

      RandomCollectData(){
        this.groups.forEach((data:any) =>{
          if(data.option.length){
            data.option.forEach((ele:any) => {
              this.randomTechData.push(ele);
            });
          }
        });
        console.log(this.randomTechData);
      }

      startHiring(){
        this.router.navigate(['/employerprofilequestion'],{queryParams: { data: 'startHiring' }});
      }
      dashboard(){
        this.router.navigate(['/dashboard']);
      }
      members(){
        
      }


}
