import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { pattern } from '../app.settings';
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
        this.router.navigate(['/talentprofilequestion']);
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
    this.httpService.get('gmail/getGmailUrl').subscribe((response: any) => {
      if(response.status){
       
      }
    });
  }

  onLinkedInLogin(){
    this.httpService.get('linkedin/getLinkedinUrl').subscribe((response: any) => {
      if(response.status){
       
      }
    });
  }

  onGithubLogin(){
    this.httpService.get('linedin/getGmailUrl').subscribe((response: any) => {
      if(response.status){
        
      }
    });
  }

}
