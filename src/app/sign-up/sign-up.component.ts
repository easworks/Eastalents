import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { pattern, roles } from '../app.settings';
import { MustMatch } from '../_helpers/must-match.validator';
import { ApiResponse, SignUpModel } from '../_models';
import { HttpService } from '../_services/http.service';
import { ToasterService } from '../_services/toaster.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: []
})
export class SignUpComponent implements OnInit {

  submitted = false;
  signUpForm!: FormGroup;
  emailForRoute='';
  firstName='';
  lastName='';
  userDataFromRoute:any;

  constructor(private formBuilder: FormBuilder, private toaster: ToasterService,
              private httpService: HttpService, private router: Router,private route: ActivatedRoute) {
                this.route.queryParams.subscribe((res)=>{
                  if(res && res.user){
                  this.userDataFromRoute = JSON.parse(res.user);
                  this.emailForRoute = this.userDataFromRoute.email || '';
                  this.firstName = this.userDataFromRoute.firstName || '';
                  this.lastName = this.userDataFromRoute.lastName || '';
                  }
                 })
   }

   ngOnInit(): void {
    this.initSignUpForm();
  }

  initSignUpForm(): void {
    this.signUpForm = this.formBuilder.group({
      firstName: [this.firstName, Validators.required],
      lastName: [this.lastName, Validators.required],
      email: [this.emailForRoute, [Validators.required, Validators.pattern(pattern.email)]],
      password: ['', [Validators.required, Validators.pattern(pattern.password)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
      userRole: [roles.talent]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

 

  // tslint:disable-next-line:typedef
  get signUpFormControl() { return this.signUpForm.controls; }

  getStarted(): void {
    this.submitted = true;
    if (this.signUpForm.invalid) {
      return;
    }
    this.httpService.post(`users/signup`, this.signUpForm.value).subscribe((response: ApiResponse<any>) => {
      if (!response.error) {
        this.toaster.success(`${response.message}`);
        this.signUpForm.reset();
        this.submitted = false;
      } else {
        this.toaster.error(`${response.message}`);
      }
    });
  }

}
