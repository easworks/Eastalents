import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class ToasterService {
    private title = 'Eastalents';

    constructor(private toastr: ToastrService) { }

    success(message: string): void {
        this.toastr.success(message, this.title);
    }

    error(message: string): void {
        this.toastr.error(message, this.title);
    }

    warning(message: string): void {
        this.toastr.warning(message, this.title);
    }

    info(message: string): void {
        this.toastr.info(message, this.title);
    }
}
