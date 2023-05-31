import { Routes } from '@angular/router';
import { NotFoundPageComponent } from 'app-shell';


export const routes: Routes = [
  {
    path: '**',
    loadComponent: () => NotFoundPageComponent
  }
];