import { Component, OnInit } from "@angular/core";
declare var $: any;

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: [],
})
export class HeaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    $(document).ready(function () {
      $('.sidemenu').click(function () {
        $('.sideWrapper').show();
        $('.overlay').show();
        $('body').toggleClass('overflow-hidden');
      });
      $('.closebtn').click(function () {
        $('.sideWrapper').hide();
        $('.overlay').hide();
      });
    });
  }
}
