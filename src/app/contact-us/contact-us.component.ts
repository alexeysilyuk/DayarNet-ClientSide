import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  name:  string;
  email: string;
  subject: string;
  messageSend: string;

  captha: string;
  capthaStr: string;
  capthaGenerate: number;

  warning: boolean = true;
  message: string = 'Please fill all fields';

  error: boolean = false;
  sucsses: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.generateProtection();
  }

  generateProtection() {
    let a = Math.round(Math.random() * 100) + 1;
    let b = Math.round(Math.random() * 100) + 1;

    let op = Math.floor(Math.random() * 2) + 1;
      if (op === 1) {
    this.capthaStr = a.toString() + ' + ' + b.toString() + ' = ';
    this.capthaGenerate = a + b;
    }

     if (op === 2) {
    this.capthaStr = a.toString() + ' - ' + b.toString() + ' = ';
    this.capthaGenerate = a - b;
    }

  }

  robotCheck() : boolean {
      let robotTest = 0;
      if (typeof(this.captha) != "number") {
        return false;
      }
      else {
      robotTest = parseInt(this.captha);
        if (robotTest !== this.capthaGenerate) {
          this.generateProtection();
          return false;
      }
      return true;
    }
  }

  onSubmit() {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  

  
     
    // fill fields
    if (this.name === undefined || this.email === undefined || this.subject === undefined || this.messageSend === undefined || this.messageSend === '' || this.captha === '' ) {
      this.message = 'All fields is required to fill';
      this.error = true;
      this.warning = false;
      this.sucsses = false;
    }

    // email
    else if( !(re.test(this.email)) ) {
      this.message = 'Email is incorrect';
      this.error = true;
      this.warning = false;
      this.sucsses = false;
    }

    // captha
     else if (! this.robotCheck()) {
      this.message = 'Your unsver is incorrect please try again';
      this.error = true;
      this.warning = false;
      this.sucsses = false;
      } 


    else {
        this.http.get('http://localhost:8080/Mail/send?from='+this.email+'&subject='+this.subject+'&message='+this.messageSend).subscribe(data => {
            if(data['status'] === 'OK') {
              this.error = false;
              this.warning = false;
              this.sucsses = true;
              this.message = 'Your message send. Our managers connect with you as soon as possible. This window will close automaticly after 5 seconds';

              setTimeout(function () { $('.contacts, .shadow').fadeOut(); }, 5000);
            }
        });
      }

    }

}
