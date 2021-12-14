import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { pattern } from '../app.settings';
import { MustMatch } from '../_helpers/must-match.validator';
import { ApiResponse } from '../_models';
import { HttpService } from '../_services/http.service';
import { ToasterService } from '../_services/toaster.service';

@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.css']
})
export class SetNewPasswordComponent implements OnInit {

  setNewPasswordForm!: FormGroup;
  submitted = false;
  constructor(private httpService: HttpService, private router: Router, private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute, private toaster: ToasterService) {}

  ngOnInit(): void {
    this.initSetNewPasswordForm();
  }

  initSetNewPasswordForm(): void {
    this.setNewPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.pattern(pattern.password)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });
  }

  // tslint:disable-next-line:typedef
  get setNewPasswordFormControl() { return this.setNewPasswordForm.controls; }

  onSetNewPassword(): void {
    this.submitted = true;
    if (this.setNewPasswordForm.invalid) {
      return;
    }
    const params = {
     token: this.activatedRoute.snapshot.queryParams.token,
     newPassword: this.setNewPasswordFormControl.newPassword.value
    };
    this.httpService.post(`users/setNewPassword`, params).subscribe((response: ApiResponse<any>) => {
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
