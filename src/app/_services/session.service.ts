import { Injectable } from '@angular/core';
import { CurrentUserModel } from '../_models';

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    setLocalStorageCredentials(user: CurrentUserModel): void {
        localStorage.setItem('currentUser',  JSON.stringify(user));
    }

    getLocalStorageCredentials(): CurrentUserModel {
        return  JSON.parse(localStorage.getItem('currentUser') || '{}');
    }

}
