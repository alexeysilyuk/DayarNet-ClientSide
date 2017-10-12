import { Component, ViewChild, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.css']
})
export class AddCityComponent implements OnInit {
  @Output() noty = new EventEmitter<{type:string, mess:string}>();
  
  @Input() API_URL : string;
  @Input() controller: string = '';

  city: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onSubmitAddCity() {
       this.http.get(this.API_URL+'/Cities/addNewCity?name='+this.city).subscribe(data => {
         console.log(data);
        });
  }

}
