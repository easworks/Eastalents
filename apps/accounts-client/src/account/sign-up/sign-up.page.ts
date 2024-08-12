import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'sign-up-page',
  templateUrl: './sign-up.page.html',
  styleUrl: './sign-up.page.less',
  imports: [
    MatTabsModule,
    RouterModule
  ]
})
export class SignUpPageComponent { }