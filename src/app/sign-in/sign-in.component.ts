import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { pattern, roles } from '../app.settings';
import { ApiResponse } from '../_models';
import { HttpService } from '../_services/http.service';
import { SessionService } from '../_services/session.service';
import { ToasterService } from '../_services/toaster.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: []
})
export class SignInComponent implements OnInit {
  submitted = false;
  signInForm!: FormGroup;
  githubLogin:boolean = false;
  githubUserName ='';
  constructor(private formBuilder: FormBuilder, private toaster: ToasterService,
              private sessionService: SessionService, private httpService: HttpService, private router: Router) { }

  ngOnInit(): void {
    this.initSignInForm();
  }

  initSignInForm(): void {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(pattern.email)]],
      password: ['', [Validators.required, Validators.pattern(pattern.password)]],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  // tslint:disable-next-line:typedef
  get signInFormControl() { return this.signInForm.controls; }

  onLogin(): void{
    this.submitted = true;
    if (this.signInForm.invalid) {
      return;
    }
    const params = {
      email: this.signInFormControl.email.value,
      password: this.signInFormControl.password.value
    };
    this.httpService.post('users/login', params).subscribe((response: ApiResponse<any>) => {
      if (response.status) {
        this.sessionService.setLocalStorageCredentials(response.result.user);
        this.signInForm.reset();
        this.submitted = false;
        if(response.result.user.role === roles.talent){
          this.router.navigate(['/Talent-Profile-Edit']);
        }
        else if(response.result.user.role === roles.employer){
          this.router.navigate(['/employer-profile']);
        }
      } else {
        this.toaster.error(`${response.message}`);
      }
    }, (error) => {
      console.log(error);
      this.signInForm.reset();
      this.submitted = false;
      this.toaster.error('Invalid data.');
    });
  }

  onGoogleLogin(){
    // this.httpService.get('gmail/getGmailUrl').subscribe((response: any) => {
    //   if(response.status){
       
    //   }
    // });
    this.router.navigateByUrl('https://eas-works.herokuapp.com/api/gmail/getGmailUrl');
  }

  onLinkedInLogin(){
    this.httpService.get('linkedin/getLinkedinUrl').subscribe((response: any) => {
      if(response.status){
       
      }
    });
  }

  showGithubLogin(){
    this.githubLogin = true;
    // let data={
    //    "login":this.githubUserName
    // }
    // this.httpService.post('github/getGithubUrl',data).subscribe((response: any) => {
    //   if(response.status){
        
    //   }
    // });
  }
  onSubmit(form: NgForm){
    let data={
       "login":form.value.login,
       "role":"talent"
    }
    this.httpService.post('github/getGithubUrl',data).subscribe((response: any) => {
      if(response.status){
        console.log(response);
      }
    });
  }

  backToGmailLogin(){
   this.githubLogin = false;
  }

}
