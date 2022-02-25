import { Component, OnInit, Output,EventEmitter } from "@angular/core";
import { Router } from "@angular/router"; 
declare var $: any;

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: [],
})
export class HeaderComponent implements OnInit {
  constructor(public router: Router) { }
  @Output() eventForSwitchTenant = new EventEmitter();

  ngOnInit(): void {
    $(document).ready(function () {
      $('.sidemenu').click(function () {
        $('.sideWrapper').show();
        $('.overlay').show();
        $('body').addClass('overflow-hidden');
      });
      $('.closebtn').click(function () {
        $('.sideWrapper').hide();
        $('.overlay').hide();
        $('body').removeClass('overflow-hidden');
      });
    });
  }

  goToUseCase(value: any) { 
    sessionStorage.setItem("useCaseName", value);
    this.router.navigate(['/useCase',value]);
    this.eventForSwitchTenant.emit('');
  }

  

}
