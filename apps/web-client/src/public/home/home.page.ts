import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'home-page',
  templateUrl: './home.page.html',
  styleUrl: './home.page.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [

  ]
})
export class HomePageComponent {



}