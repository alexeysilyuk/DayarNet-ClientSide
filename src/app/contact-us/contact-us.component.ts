import { Component, OnInit, ViewChild, Output,Input, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  @ViewChild('f') contactForm : NgForm;
  @Input() API_URL : string;
  @Output() noty = new EventEmitter<{type:string, mess:string}>();

  name:  string;
  email: string;
  subject: string;
  messageSend: string;

  captha: string;
  capthaStr: string;
  capthaGenerate: number;


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
    // captha
    if (! this.robotCheck()) {
      this.noty.next({type:"warning", mess:"Security code is wrong"});
     } 


    else {
        this.http.get(this.API_URL+'/Mail/send?from='+this.email+'&subject='+this.subject+'&message='+this.messageSend).subscribe(data => {
            if(data['status'] === 'OK') {

              this.noty.next({type:"success", mess:"Your message send. Our managers connect with you as soon as possible. This window will close automaticly after 5 seconds"});

              this.contactForm.reset();
              setTimeout(() => {
                $('.shadow, .contacts').fadeOut();
              }, 5000);
              
            }
        });
      }

    }

}
