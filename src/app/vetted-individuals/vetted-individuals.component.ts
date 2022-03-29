import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vetted-individuals',
  templateUrl: './vetted-individuals.component.html',
  styleUrls: ['./vetted-individuals.component.scss']
})
export class VettedIndividualsComponent implements OnInit {
  public title: any;
  public vettedIndividuals: any = sessionStorage.getItem("vettedIndividuals");
  public compareTableValies: any = [
    { "scope": "Scope", "vetted": "Not set", "full_teams": "Estimated", "project_based": "Predefined" },
    { "scope": "Timeline", "vetted": "Predefined", "full_teams": "Estimated", "project_based": "Predefined" },
    { "scope": "Control", "vetted": "High", "full_teams": "Medium", "project_based": "Low" },
    { "scope": "Flexibility", "vetted": "High", "full_teams": "Medium", "project_based": "Low" },
    { "scope": "Team Scalability", "vetted": "High", "full_teams": "Medium to high", "project_based": "Low" },
    { "scope": "Responsibility for Execution & Deliverables", "vetted": "Client", "full_teams": "Shared", "project_based": "EASWORKS" },
    { "scope": "Client Involvement", "vetted": "High", "full_teams": "Medium", "project_based": "Low" },
    { "scope": "Client Technical Expertise/Leadership", "vetted": "Required", "full_teams": "Recommended", "project_based": "Optional" },
    { "scope": "Communication with Outsourced Team", "vetted": "Daily", "full_teams": "Frequent", "project_based": "Occasional" },
    { "scope": "Overlap with In-House Team", "vetted": "High", "full_teams": "Some", "project_based": "None" },
    { "scope": "Product Management", "vetted": "Client", "full_teams": "Shared", "project_based": "Client" },
    { "scope": "High Level Management", "vetted": "Client", "full_teams": "Shared", "project_based": "EASWORKS" },
    { "scope": "Task Management", "vetted": "Client", "full_teams": "EASWORKS", "project_based": "EASWORKS" },
    { "scope": "Project Management", "vetted": "Client", "full_teams": "EASWORKS", "project_based": "EASWORKS" },
    { "scope": "Operations Supervisionscope", "vetted": "Client", "full_teams": "EASWORKS", "project_based": "EASWORKS" },
    { "scope": "Workflow Development", "vetted": "Client", "full_teams": "EASWORKS", "project_based": "EASWORKS" },
  ]
  vettedIndividualsPageDetails: any;
  constructor() {
    this.vettedIndividuals = JSON.parse(this.vettedIndividuals);
    window.scrollTo(0, 0);
    console.log(this.vettedIndividuals);
    this.title = this.vettedIndividuals['title'];
  }

  ngOnInit(): void {
  }

}
