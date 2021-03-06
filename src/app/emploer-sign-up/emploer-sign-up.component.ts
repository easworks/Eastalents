import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { pattern, roles } from '../app.settings';
import { MustMatch } from '../_helpers/must-match.validator';
import { ApiResponse, SignUpModel } from '../_models';
import { HttpService } from '../_services/http.service';
import { ToasterService } from '../_services/toaster.service';


@Component({
  selector: 'app-emploer-sign-up',
  templateUrl: './emploer-sign-up.component.html',
  styleUrls: []
})
export class EmploerSignUpComponent implements OnInit {

  submitted = false;
  signUpForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private toaster: ToasterService,
              private httpService: HttpService, private router: Router) {
    this.initSignUpForm();
   }

  initSignUpForm(): void {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(pattern.email)]],
      password: ['', [Validators.required, Validators.pattern(pattern.password)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
      userRole: [roles.employer]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  ngOnInit(): void {
  }
  get signUpFormControl() { return this.signUpForm.controls; }

  getStarted(): void {
    this.submitted = true;
    if (this.signUpForm.invalid) {
      return;
    }
    this.httpService.post(`users/signup`, this.signUpForm.value).subscribe((response: ApiResponse<any>) => {
      if (!response.error) {
        this.router.navigate(['/employerprofilequestion']);
        this.toaster.success(`${response.message}`);
        this.signUpForm.reset();
        this.submitted = false;
      } else {
        this.toaster.error(`${response.message}`);
        this.submitted =false;
      }
    });
  }

}
