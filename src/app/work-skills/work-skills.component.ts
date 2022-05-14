import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-work-skills',
  templateUrl: './work-skills.component.html',
  styleUrls: []
})
export class WorkSkillsComponent implements OnInit {

  constructor(private http: HttpClient) { }
  currentIndex:number=0;
  workSkillsQuestion:any=[];

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    return this.http.get('/assets/workSkills.json').subscribe( (res:any) =>{
      this.workSkillsQuestion=[...res]
      console.log(this.workSkillsQuestion);
      this.workSkillsQuestion = this.workSkillsQuestion.sort(() => Math.random() - 0.5)
    });
  }

  increaseIndex(){
    this.currentIndex++;
  }
  decreaseIndex(){
    this.currentIndex--;
  }

}
