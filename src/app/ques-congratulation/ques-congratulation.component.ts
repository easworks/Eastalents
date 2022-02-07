import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ques-congratulation',
  templateUrl: './ques-congratulation.component.html',
  styleUrls: ['./ques-congratulation.component.css']
})
export class QuesCongratulationComponent implements OnInit {

  constructor(private router:Router) { }

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
   console.log(this.feedback1)
   console.log(this.feedback2)
   console.log(this.feedback3)
   console.log(this.feedback4)
   console.log(this.feedback5)
  //  console.log(this.str)
  this.router.navigate(['/Talentprofileview']);
  }

}
