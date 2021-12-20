import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { pattern } from '../app.settings';
import { MustMatch } from '../_helpers/must-match.validator';
import { ApiResponse } from '../_models';
import { HttpService } from '../_services/http.service';
import { SessionService } from '../_services/session.service';
import { ToasterService } from '../_services/toaster.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  submitted = false;
  constructor(private httpService: HttpService, private router: Router, private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute, private toaster: ToasterService,
              private sessionService: SessionService) { }

  ngOnInit(): void {
    this.initChangePasswordForm();
  }

  initChangePasswordForm(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.pattern(pattern.password)]],
      newPassword: ['', [Validators.required, Validators.pattern(pattern.password)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });
  }

  // tslint:disable-next-line:typedef
  get changePasswordFormControl() { return this.changePasswordForm.controls; }

  onChangePassword(): void {
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    const params = {
      userId: this.sessionService.getLocalStorageCredentials()._id,
      newPassword: this.changePasswordFormControl.newPassword.value,
      oldPassword: this.changePasswordFormControl.oldPassword.value
    };
    this.httpService.post(`users/reSetPassword`, params).subscribe((response: ApiResponse<any>) => {
      if (response.status) {
        this.toaster.success(`${response.message}`);
        setTimeout(() => {
          this.router.navigate(['/signin']);
        }, 3000);
      } else {
        this.toaster.error(`${response.message}`);
      }
      this.submitted = false;
    }, (error) => {
      console.log(error);
      this.submitted = false;
      this.toaster.error('Invalid data');
      setTimeout(() => {
        this.router.navigate(['/signin']);
      }, 3000);
    });
  }
}

