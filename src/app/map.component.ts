import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
declare var google: any;


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class AppComponent implements OnInit  {
  title: string = 'My first AGM project';
  lat: number = 0.0;
  lng: number = 0.0;
  selectedValue = null;
  res = '';
  cites = [
    {id: 1, name: 'Beersheba'},
    {id: 2, name: 'Jerusalem'},
    {id: 3, name: 'Haifa'},
    {id: 4, name: 'TelAviv'},
    {id: 5, name: 'Eilat'}
  ];



  
constructor(private http: HttpClient) {
  this.lat = -10.31;
  this.lng = 34.73;
  this.res = "test";
  this.selectedValue = this.cites[0].name;
}

ngOnInit(){}


getPosition() {
  this.getLocation();
}

 getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position){
        console.log(position.coords.latitude);
        this.test2(position.coords.latitude,  position.coords.longitude);
      });

  } else {
      console.log("Geolocation is not supported by this browser.");
  }
}
 

  changeSelect(value){
    console.log(value);
    this.selectedValue = value;
  }
  
  test() {
   // Make the HTTP request:
   this.http.get('http://localhost:8080/Cities/find?by=name&value='+this.selectedValue).subscribe(data => {
    // Read the result field from the JSON response.
    this.res = data['city'][0]['name'];
    this.lat =  data['city'][0]['lat'];
    this.lng =  data['city'][0]['lng'];
  });
 }


 test2(l1:number, l2:number) {
  // Make the HTTP request:
   this.lat =  l1;
   this.lng =  l2;
 }


 onUpdateServer(event: Event) {
  this.selectedValue = (<HTMLInputElement>event.target).value;
}

}