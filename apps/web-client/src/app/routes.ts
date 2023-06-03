import { Routes } from '@angular/router';
import { NotFoundPageComponent } from '@easworks/app-shell';


export const routes: Routes = [
  {
    path: '**',
    loadComponent: () => NotFoundPageComponent
  }
];