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
  @Input() citySend: string = '';

  @ViewChild('CityNeibrhood') cityForm : NgForm;
  @ViewChild('NeibrhoodForm') NeibrhoodForm : NgForm;

  city: string = '';
  nbh: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onSubmitAddCity() {
     this.city = this.cityForm.value.city;
       this.http.get(this.API_URL+'/User/addNewCity?name='+this.city).subscribe(data => {
         if(data['status'] === 'success') {
           this.noty.next({type:"success", mess: data['msg']});
           $(".addNewCityNeibrhood, .shadow").fadeOut();
         }
         else {
           this.noty.next({type:"warning", mess: data['msg']});
         }
        });
  }


  onSubmitAddNeighborhood() {
    this.nbh = this.NeibrhoodForm.value.nbh;
       this.http.get(this.API_URL+'/User/addNewNeighborhood?city='+this.citySend+'&name='+this.nbh).subscribe(data => {
          if(data['status'] === 'success') {
           this.noty.next({type:"success", mess: data['msg'] });
           $(".addNewCityNeibrhood, .shadow").fadeOut();
         }
         else {
           this.noty.next({type:"warning", mess: data['msg']});
         }
        });
  }

}
