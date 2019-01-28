import { Component, OnInit } from '@angular/core';
import { Noty } from './directives/noty.directive';

@Component({
    selector: 'app-component',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  API_URL = 'https://myserver.net';

  componentDisplay = 'home';

  notyMessage: string;
  notyType: string;
  notyShow: boolean = false;

  openNoty(notyObj) {
      this.notyMessage = notyObj.mess;

      switch (notyObj.type) {
        case "warning":
        this.notyType = "alert-warning";
        break;

        case "error":
        this.notyType = "alert-danger";
        break;

        case "success":
        this.notyType = "alert-success";
        break;

        default:
        this.notyType = "alert-info";
        break;
      }

      this.notyShow = true;

      setTimeout(() => {
        this.notyShow = false;
       }, 5000);
  }

  closeNoty(notyObj) {
    this.notyShow = notyObj;
  }

    constructor() {}

    ngOnInit() {}


  onNavigate(coponent: string) {
    this.componentDisplay = coponent;
    console.log(this.componentDisplay);
  }


}
