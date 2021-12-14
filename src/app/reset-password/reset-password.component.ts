import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { pattern } from '../app.settings';
import { ApiResponse } from '../_models';
import { HttpService } from '../_services/http.service';
import { ToasterService } from '../_services/toaster.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: []
})
export class ResetPasswordComponent implements OnInit {
  submitted = false;
  resetPasswordForm!: FormGroup;
  constructor(private formBuilder: FormBuilder, private toaster: ToasterService,
              private httpService: HttpService, private router: Router) { }

  ngOnInit(): void {
    this.initResetPasswordForm();
  }

  initResetPasswordForm(): void {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(pattern.email)]]
    });
  }

  // tslint:disable-next-line:typedef
  get resetPasswordFormControl() { return this.resetPasswordForm.controls; }

  onResetPassword(): void {
    this.submitted = true;
    if (this.resetPasswordForm.invalid) {
      return;
    }
    this.httpService.post('users/forgotPassword', this.resetPasswordForm.value).subscribe((response: ApiResponse<any>) => {
      if (response.status) {
        this.resetPasswordForm.reset();
        this.submitted = false;
        this.toaster.success(`${response.message}`);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      } else {
        this.toaster.error(`${response.message}`);
      }
    }, (error) => {
      console.log(error);
      this.resetPasswordForm.reset();
      this.submitted = false;
      this.toaster.error('Invalid data.');
    });
  }
}
