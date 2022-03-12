import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-talent-profile-edit',
  templateUrl: './talent-profile-edit.component.html',
  styleUrls: []
})
export class TalentProfileEditComponent implements OnInit {

  talentProfileData:any=[]; 
  talentQuestionData:any=[];
   data = [{'group':'1', 'name':'name1'},
{'group':'2', 'name':'name2'},
{'group':'2', 'name':'name3'},
,{'group':'1', 'name':'name4'}]; 
groups:any=[];
randomTechData:any=[];

  constructor(private http: HttpClient,private router: Router,) { }

  ngOnInit(): void {
    this.getData()
  }

  getData(){
    return this.http.get('/assets/talentquestion.json').subscribe( (res:any) =>{
      this.talentQuestionData.push(...res);
      console.log(this.talentQuestionData);
      this.formatData();
    });
  }

  formatData(){
    const list = this.talentQuestionData[1].button.map( (i:any) => i.value);
   this.groups= list.map( (c:any) => { 
            return  { group:c, option:[]};
        } ); 

 this.talentQuestionData[1].option.forEach( (d:any) => { 
    this.groups.forEach((data:any)=>{
      if(data.group.toLowerCase() === d.group.toLowerCase()){
        data.option.push(d);
      }
    });
});
  

  console.log(list);
  console.log(this.groups);
  this.RandomCollectData();
      }

  RandomCollectData(){
    this.groups.forEach((data:any) =>{
      let techData = data.option[Math.floor(Math.random() * data.option.length)];
      this.randomTechData.push(techData);
    });
    console.log(this.randomTechData);
  }

      onUpdate(){
        this.router.navigate(['/talentprofilequestion'], { queryParams: { id: '1' } });
      }
      takeTest(){
        this.router.navigate(['/question-category']);
      }
}
