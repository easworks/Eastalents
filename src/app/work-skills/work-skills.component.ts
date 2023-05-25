import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../_services/http.service';
import { SessionService } from '../_services/session.service';
import { ToasterService } from '../_services/toaster.service';

@Component({
  selector: 'app-work-skills',
  templateUrl: './work-skills.component.html',
  styleUrls: ['./work-skills.component.css']
})
export class WorkSkillsComponent implements OnInit {

  constructor(private http: HttpClient,private router: Router,private httpService: HttpService,
    private route: ActivatedRoute,private toaster: ToasterService,private sessionService: SessionService,) { }
  currentIndex:number=0;
  workSkillsQuestion:any=[];

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    return this.http.get('/assets/workSkills.json').subscribe( (res:any) =>{
      this.workSkillsQuestion=[...res]
      console.log(this.workSkillsQuestion);
      this.workSkillsQuestion.forEach((workdata:any) => {
        workdata.data = workdata.data.sort(() => Math.random() - 0.5)
      });
      this.workSkillsQuestion = this.workSkillsQuestion.sort(() => Math.random() - 0.5)
    });
  }

  increaseIndex(){
    if(this.currentIndex === 29){
        this.saveDiscData();
    }
    else{

      this.currentIndex++;
    }
  }
  decreaseIndex(){
    this.currentIndex--;
  }

  formatDiscData(){
    let saveOptionData:any=[];
    this.workSkillsQuestion.forEach((workdata:any) => {
      saveOptionData.push({questionId:workdata.id,mostId:workdata.mostOptionId,leastId:workdata.LeastOptionId})
    });

    return saveOptionData;
  }

  saveDiscData(){
    let data={
      userId:this.sessionService.getLocalStorageCredentials()._id,
      data:this.formatDiscData()
    }
    this.httpService.post('disc/sendDisc',data).subscribe((response: any) => {
      if (!response.error) {
        this.router.navigate(['/Talent-Profile-Edit']);
      }
    }, (error) => {
      console.log(error);
      this.toaster.error(`${error.message}`);
    });
  }

}
