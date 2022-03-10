import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-talent-profile-edit',
  templateUrl: './talent-profile-edit.component.html',
  styleUrls: []
})
export class TalentProfileEditComponent implements OnInit {

  talentProfileData:any=[]; 
   data = [{'group':'1', 'name':'name1'},
{'group':'2', 'name':'name2'},
{'group':'2', 'name':'name3'},
,{'group':'1', 'name':'name4'}]; 

  constructor() { }

  ngOnInit(): void {
    this.formatData()
  }

  formatData(){
    const list = this.data.map( (i:any) => i.group);
const unique = [...new Set(list)];
const groups:any= unique.map( c => { 
            return  { group:c, names:[]};
        } ); 

// const dt = this.data.forEach( (d:any) => { 
//     return groups.find( (g:any)=> g.group === d.group).names.push(d.name);
// });
  

  console.log(list);
  console.log(unique);
  console.log(groups);
  // console.log(dt);
      }

}
