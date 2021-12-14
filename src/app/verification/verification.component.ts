import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from '../_models';
import { HttpService } from '../_services/http.service';
import { ToasterService } from '../_services/toaster.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  constructor(private httpService: HttpService, private router: Router,
              activatedRoute: ActivatedRoute, private toaster: ToasterService) {
    const token = activatedRoute.snapshot.queryParams.token;
    this.httpService.post(`users/verification`, { token }).subscribe((response: ApiResponse<any>) => {
      if (!response.error) {
        this.toaster.success(`${response.message}`);
        setTimeout(() => {
          this.router.navigate(['/signin']);
        }, 3000);
      } else {
        this.toaster.error(`${response.message}`);
      }
    }, (error) => {
      console.log(error);
      this.toaster.error('Invalid data');
      setTimeout(() => {
        this.router.navigate(['/signin']);
      }, 3000);
    });
  }

  ngOnInit(): void {}

}
