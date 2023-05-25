import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../_services/http.service';
import { SessionService } from '../_services/session.service';
import { ToasterService } from '../_services/toaster.service';

@Component({
  selector: 'app-ques-congratulation',
  templateUrl: './ques-congratulation.component.html',
  styleUrls: ['./ques-congratulation.component.css']
})
export class QuesCongratulationComponent implements OnInit {

  constructor(private router:Router,private httpService: HttpService,private toaster: ToasterService,private sessionService: SessionService) { }

  feedback1='';
  feedback2='';
  feedback3='';
  feedback4='';
  feedback5='';

  // feedback={
  //   yes1:'',
  //   no1:'',
  //   yes2:'',
  //   no2:'',
  //   yes3:'',
  //   no3:'',
  //   yes4:'',
  //   no4:'',
  //   yes5:'',
  //   no5:'',
  // }
  str='';

  ngOnInit(): void {
  }

  onSubmitFeedback(){
    this.sendFeedBack();
  }


  sendFeedBack(){
    let talent={
      "feedback1":this.feedback1,
      "feedback2":this.feedback2,
      "feedback3":this.feedback3,
      "feedback4":this.feedback4,
      "feedback5":this.feedback5,
      "str":this.str

    }
    let data:any={
      userId: this.sessionService.getLocalStorageCredentials()._id,
      feedbackSteps:JSON.stringify(talent)
    }
    this.httpService.post('talentProfile/updateTalentProfileFeedback',{}).subscribe((res:any)=>{
         if(res.status === 'success'){
          this.router.navigate(['/Talentprofileview']);
         }
    });
  }

}
