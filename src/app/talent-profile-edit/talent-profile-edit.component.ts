import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../_models';
import { HttpService } from '../_services/http.service';
import { SessionService } from '../_services/session.service';
import { TalentService } from '../_services/talent.service';
import { ToasterService } from '../_services/toaster.service';

@Component({
  selector: 'app-talent-profile-edit',
  templateUrl: './talent-profile-edit.component.html',
  providers: [TalentService],
  styleUrls: []
})
export class TalentProfileEditComponent implements OnInit,AfterViewInit {


  @ViewChild('videoPlayer') videoPlayer!: ElementRef;

  dataLoaded = false;
  videoStarted = false;
  talentProfileData:any=[]; 
  talentQuestionData:any=[];
  dataToDisplay:any={};  
  personalData:any={};
  groups:any=[];
randomTechData:any=[];
imgUrl='';
selectedImage:any;
public imageBaseUrl = `${environment.imageUrl}`;
viewResume:any;
videoUrl:any;

  constructor(private http: HttpClient,private router: Router,private httpService: HttpService,
    private route: ActivatedRoute,private toaster: ToasterService,private sessionService: SessionService,
    private talentService: TalentService,) { }

  ngOnInit(): void {
    this.getTalentProfile();
    this.getImage();
    this.getVideo();
    this.getPdf();

  }

  ngAfterViewInit(): void {
    this.videoPlayer.nativeElement.onloadeddata = (event:any) => {
      console.log('Video data is loaded.');
      this.dataLoaded = true;
    };

    this.videoPlayer.nativeElement.onplaying = (event:any) => {
      console.log('Video is no longer paused.');
      this.videoStarted = true;
    };
  }

  getImage(){
    let data={
      userId:this.sessionService.getLocalStorageCredentials()._id,
    }
    this.httpService.post('talentProfile/getTalentProfilePhoto',data).subscribe((response: any) => {
      if (!response.error) {
        // this.toaster.success(`${response.message}`);
        console.log(response);
        this.imgUrl = response.userData.file.path;

      }
    }, (error) => {
      console.log(error);
      this.toaster.error(`${error.message}`);
    });
  }
  getVideo(){
    let data={
      userId:this.sessionService.getLocalStorageCredentials()._id,
    }
    this.httpService.post('talentProfile/getTalentProfileVideo',data).subscribe((response: any) => {
      if (!response.error) {
        // this.toaster.success(`${response.message}`);
        console.log(response);
        this.videoUrl = this.imageBaseUrl + response.userData.file.path;
        console.log(this.videoUrl);

      }
    }, (error) => {
      console.log(error);
      this.toaster.error(`${error.message}`);
    });
  }

  getPdf(){
    let data={
      userId:this.sessionService.getLocalStorageCredentials()._id,
    }
    this.httpService.post('talentProfile/getTalentProfileResume',data).subscribe((response: any) => {
      if (!response.error) {
        // this.toaster.success(`${response.message}`);
        console.log(response);
        // this.imgUrl = response.userData.file.path;
        this.viewResume =  response.userData;

      }
    }, (error) => {
      console.log(error);
      this.toaster.error(`${error.message}`);
    });
  }
  viewPdf(){
    const url = this.imageBaseUrl + this.viewResume.file.path;
   window.open(url,'_blank');
  }

  onImage(event:any){
    this.selectedImage = event.target.files[0]
    console.log(this.selectedImage);
    this.uploadImage();
  }
  uploadImage(){
    const uploadData = new FormData();
    uploadData.append('talentProfilePhoto', this.selectedImage, this.selectedImage.name);
    uploadData.append('userId',this.sessionService.getLocalStorageCredentials()._id);
    this.httpService.post('talentProfile/setTalentProfilePhoto',uploadData).subscribe((response: ApiResponse<any>) => {
      if (!response.error) {
        this.toaster.success(`${response.message}`);
      }
    }, (error) => {
      console.log(error);
      this.toaster.error(`${error.message}`);
    });
  }

  getTalentProfile(){
    let data:any={
      userId: this.sessionService.getLocalStorageCredentials()._id
    }
    this.httpService.post('talentProfile/getTalentProfile',data).subscribe((response:any) => {
      if (!response.error) {
        this.toaster.success(`${response.message}`);
        this.talentQuestionData = response.steps;
        this.formatData();
      }
    }, (error) => {
      console.log(error);
      this.toaster.error(`${error.message}`);
    });
  }

  getData(){
    return this.http.get('/assets/talentquestion.json').subscribe( (res:any) =>{
      this.talentQuestionData.push(...res);
      console.log(this.talentQuestionData);
      this.formatData();
    });
  }

  formatData(){
    let arrData=[];
    const list = this.talentQuestionData[8].button.map( (i:any) => i.value);
   this.groups= list.map( (c:any) => { 
            return  { group:c, option:[]};
        } ); 

  
    this.groups.forEach((data:any)=>{
      arrData = this.talentQuestionData[8].option.filter((item:any) => item.group === data.group && item.selected === true);
      data.option.push(...arrData);
});
  

  console.log(list);
  console.log(this.groups);
  this.RandomCollectData();
  this.saveRequiredData();
      }

  RandomCollectData(){
    this.groups.forEach((data:any) =>{
      if(data.option.length){
        let techData = data.option[Math.floor(Math.random() * data.option.length)];
        this.randomTechData.push(techData);
      }
    });
    console.log(this.randomTechData);
  }

  saveRequiredData(){
    this.personalData.firstName = this.sessionService.getLocalStorageCredentials().firstName;
    this.personalData.lastName = this.sessionService.getLocalStorageCredentials().lastName;
    this.personalData.email = this.sessionService.getLocalStorageCredentials().email;
    this.dataToDisplay.profileSummary=this.talentQuestionData[1].profileSummary;
    this.dataToDisplay.city=this.talentQuestionData[1].city;
    this.dataToDisplay.state=this.talentQuestionData[1].state;
    this.dataToDisplay.country=this.talentQuestionData[1].country;
    this.dataToDisplay.phoneNumber=this.talentQuestionData[12].phonenumber;
    this.dataToDisplay.phoneNumber2=this.talentQuestionData[12].phonenumber2;
    this.dataToDisplay.phoneCode=this.talentQuestionData[12].phoneCode;
    this.dataToDisplay.phoneCode2=this.talentQuestionData[12].phoneCode2;
    this.dataToDisplay.LinkedIn=this.talentQuestionData[13].option[0].value;
    this.dataToDisplay.GitHub=this.talentQuestionData[13].option[1].value;
    this.dataToDisplay.GitLab=this.talentQuestionData[13].option[2].value;
    this.dataToDisplay.bitbucket=this.talentQuestionData[13].option[3].value;
    this.dataToDisplay.stackOverflow=this.talentQuestionData[13].option[4].value;
    this.dataToDisplay.portfolio=this.talentQuestionData[13].option[5].value;
    this.dataToDisplay.otherurl=this.talentQuestionData[13].option[6].value;
    this.dataToDisplay.weeklyHourlyRate=this.talentQuestionData[11].data.weeklyHourlyRate;
    this.dataToDisplay.targetAnnualSalary=this.talentQuestionData[11].data.targetAnnualSalary;
    this.dataToDisplay.monthlyRate=this.talentQuestionData[11].data.monthlyRate;
    this.dataToDisplay.desiredHourlyRate=this.talentQuestionData[11].data.desiredHourlyRate;
    this.dataToDisplay.preferredPLM=this.talentQuestionData[11].data.preferredPLM;
    this.dataToDisplay.currentPLM=this.talentQuestionData[11].data.currentPLM;
    // this.personalData.firstName=this.personalData.firstName + ' ';
  }

      onUpdate(opt:any){
        this.router.navigate(['/talentprofilequestion'],{state:{data :this.talentQuestionData} ,queryParams: { id: opt } });
        // this.talentService.invokeTalentData(this.talentQuestionData);
      }
      takeTest(){
        this.router.navigate(['/question-category']);
      }
}
