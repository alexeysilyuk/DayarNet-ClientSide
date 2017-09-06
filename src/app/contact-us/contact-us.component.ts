import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  name:  '';
  email: '';
  subject: '';
  messageSend: '';

  constructor(private http: HttpClient) { }

  ngOnInit() {}

  onSubmit() {
    this.http.get('http://localhost:8080/Mail/send?from='+this.email+'&subject='+this.subject+'&message='+this.messageSend).subscribe(data => {
      console.log(data);
    });
  }

}
