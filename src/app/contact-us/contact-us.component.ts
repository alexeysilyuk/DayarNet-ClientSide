import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  myform: FormGroup;

  constructor() { }

  ngOnInit() {
    // this.myform = new FormGroup({
    //   // name: email: new FormControl(),
    //   // email: new FormControl(),
    //   // password: new FormControl(),
    //   // language: new FormControl()
    // });
  }

  onSubmit() {
    // if (this.myform.valid) {
    //   console.log("Form Submitted!");
    // }
  }

}
