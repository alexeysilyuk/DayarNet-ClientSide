import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-component',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  componentDisplay = 'home';



    constructor() {}

    ngOnInit() {}


  onNavigate(coponent: string) {
    this.componentDisplay = coponent;
    console.log(this.componentDisplay);
  }


}
