import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  emailForRoute='';
  userDataFromRoute:any;
  constructor(private formBuilder: FormBuilder, private toaster: ToasterService,
              private sessionService: SessionService, private httpService: HttpService, private router: Router,
              private route: ActivatedRoute) {
                
               this.route.queryParams.subscribe((res)=>{
                if(res && res.user){
                this.userDataFromRoute = JSON.parse(res.user);
                this.emailForRoute = this.userDataFromRoute.email || '';
                }
               })
              }

  ngOnInit(): void {
    this.initSignInForm();
  }

  initSignInForm(): void {
    this.signInForm = this.formBuilder.group({
      email: [this.emailForRoute, [Validators.required, Validators.pattern(pattern.email)]],
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


  showGithubLogin(){
    this.githubLogin = true;
  }

  backToGmailLogin(){
   this.githubLogin = false;
  }

}
