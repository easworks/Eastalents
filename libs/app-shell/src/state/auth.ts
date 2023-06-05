import { Injectable, signal } from '@angular/core';
import { User } from '@easworks/models';

@Injectable({
  providedIn: 'root'
})
export class AuthState {
  readonly user$ = signal<User | null>(null);
}