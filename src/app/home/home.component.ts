import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';

import {enableProdMode} from '@angular/core';
enableProdMode();

import { GoogleMapDirective } from '../../app/directives/google-map.directive';
import { GoogleMapMarkerDirective } from '../../app/directives/google-map-marker.directive';

import { Noty } from '../../app/directives/noty.directive';

import { MapsService } from '../../app/services/maps.service';
import { GeolocationService } from '../../app/services/geolocation.service';
import { GeocodingService } from '../../app/services/geocoding.service';


import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

//import { Http, Headers } from '@angular/http';

import {City } from '../model/city.model';
import {Neighborhood } from '../model/neighborhood.model';
import {Dira} from '../model/dira.model';
import {Location} from '../model/location.model';


declare var $: any; // jQuery

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  @Input() API_URL : string;
  @Output() noty = new EventEmitter<{type:string, mess:string}>();

  manage_property_control = '';
  manage_switch_load  = false;

  // Center map. Required.
  center: google.maps.LatLng;

  // MapOptions object specification.

  // The initial map zoom level. Required.
  zoom: number;

  disableDefaultUI: boolean;
  disableDoubleClickZoom: boolean;
  mapTypeId: google.maps.MapTypeId;
  maxZoom: number;
  minZoom: number;
  styles: Array<google.maps.MapTypeStyle>;

  // Marker position. Required.
  positions: google.maps.LatLng[] = [];
  position: google.maps.LatLng;

  // Marker title.
  title: string;

  // Info window.
  content: string;

  // Address to be searched.
  address: string;

  // Warning flag & message.
  warning: boolean;
  message: string;


  basicActionsActive: boolean;
  searchDirot: boolean;

  // json object
  cities: City[] =  [];
  citiesAutoComplete: string[] = [];
  neighborhoods: Neighborhood[] = [];
  neighborhoodsAutoComplete: string[] = [];
  dirot: Dira[] = [];
  dira: Dira;
  autoClean: string = '';
  userOpenSwitch = false;
  addFormControl: string = '';

  // user location
  user_lat: number;
  user_lng: number;

  // dira params
    street:string;
    houseNumber: number;
    rooms:number;
    area:number;
    arnona:number;
    price:number;
    baal:string;
    phone:string;
    email:string;
    floor: number;
    type: string;
    entranceDate: string;
  
  searchRes: string
  misparDirot: number = 0;
  selectedCity: number;
  selectedNeighborhood: number;

  selectedCityName: string = '';
  cityHasNeighborhoods:boolean;

  diraAdded: boolean = false;
  DiraMessage: string;

  propertyTypes: string[] = ['דירה','דירת גן','בית מלון','גג/פנטהאוז','סטודיו/לופט','דירת נופש',
'מרתף/פרטר','דופלקס','טריפלקס','פרטי/קוטג','דו משפחתי','יחידת דיור','משק חקלאי/נחלה','מחסן','מגרש','דיור מוגן','בניין מגורים'];


      userLoggedin : boolean = false;
      userEmail : string = '';
      userisAdmin: boolean = false;

      globalUser = {email: '', password: ''};

// step by step add flat property
currentStep : number = 0;
maxStep: number = 4;
progress: number = 0;
leftMovePosition:number = 0;
stepTitle: string = 'תנאי שימוש באתר';
@ViewChild('addform') flatForm : NgForm;

// navigation header
  componentDisplay = 'home';


  constructor(public maps: MapsService, private geolocation: GeolocationService, private geocoding: GeocodingService, private http: HttpClient) {

    this.selectedCity = 0;
    this.selectedNeighborhood = 0;
    this.searchDirot = false;

    this.center = new google.maps.LatLng(31.598214, 34.789267599999995);
    this.zoom = 10;

    // Other options.
    this.disableDefaultUI = true;
    this.disableDoubleClickZoom = false;
    this.mapTypeId = google.maps.MapTypeId.ROADMAP;
    this.maxZoom = 18;
    this.minZoom = 4;

    // Initially the marker isn't set

    this.address = '';

    this.warning = false;
    this.message = '';

    // temp dirot
    this.dirot =  [];
  }

  ngOnInit() {
    if (this.getCookie("gEmail")) {
      this.setLogin( {status:true, email: this.getCookie("gEmail"), password: '', isAdmin: false} );
    }

    if (this.getCookie("rEmail")) {
      this.setLogin( {status:true, email: this.getCookie("rEmail"), password: this.getCookie("rPassword"), isAdmin: this.getCookie("risAdmin")} );
    }

    this.loadCity();


 //$ ( () => {  

    // datapicker
    $( ".datepicker" ).datepicker({ 
        dateFormat: 'dd/mm/yy',
        showButtonPanel: true,
        changeMonth: true,
        changeYear: true,
        currentText: 'תאריך נוכחי',
        closeText : 'סגור חלון',
        yearRange: '2014:2017'
    });

    // autocomplete
      $( "#cityBox" ).autocomplete({ 
          source: this.citiesAutoComplete,
          select: (event, ui)=>  {
            this.callCity(ui.item.value);
          }
       });

      $( "#neighborhoodBox" ).autocomplete({ 
          source: this.neighborhoodsAutoComplete,
          select: (event, ui)=>  {
            this.callNeighborhood(ui.item.value);
          },
       });

    
    //});
  }

  // accordion 
  toggleAccardion(i: number) {
    $("#propertyAcc"+i).slideToggle();
  }

 getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

deleteCookie(cname) {
  document.cookie = cname+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

  onNavigate(coponent: string) { this.componentDisplay = coponent; }

  getCurrentPosition() {
    this.warning = false;
    this.message = '';

    if (navigator.geolocation) {
      this.geolocation.getCurrentPosition().forEach(
        (position: Position) => {
          if (this.center.lat() !== position.coords.latitude && this.center.lng() !== position.coords.longitude) {
            // New center object: triggers OnChanges.
           
           // this.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
           // this.zoom = 11;

             // save user location
             this.user_lat = position.coords.latitude;
             this.user_lng = position.coords.longitude;

             //console.log( this.user_lat, this.user_lng);

            // Translates the location into address.
            this.geocoding.geocode(this.center).forEach(
              (results: google.maps.GeocoderResult[]) => {
                this.setMarker(this.center, 'your locality', results[0].formatted_address);
              }
            ).then(() => console.log('Geocoding service: completed.'));
          }
        }
      ).then(() =>  console.log('Geolocation service: completed.')).catch(
        (error: PositionError) => {
          if (error.code > 0) {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                
                this.noty.next({type: "warning", mess: " Geolocation: permission denied"});
                break;
              case error.POSITION_UNAVAILABLE:
              this.noty.next({type: "warning", mess: " Geolocation: position unavailable"});
                break;
              case error.TIMEOUT:
              this.noty.next({type: "warning", mess: " Geolocation: position timeout"});
                break;
            }
            this.warning = true;
          }
        });
    } else {
      this.message = 'browser doesn\'t support geolocation';
      this.warning = true;
    }
  }

  search(address: string) {
    if (address != '') {
      this.warning = false;
      this.message = '';
      // Converts the address into geographic coordinates.
      this.geocoding.codeAddress(address).forEach(
        (results: google.maps.GeocoderResult[]) => {
          if (!this.center.equals(results[0].geometry.location)) {
            // New center object: triggers OnChanges.
            this.center = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
            this.zoom = 11;

            this.setMarker(this.center, 'search result', results[0].formatted_address);
          }
        }
      ).then(
        () => {
          this.address = '';
          console.log('Geocoding service: completed.');
        }).catch(
        (status: google.maps.GeocoderStatus) => {
          if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
            this.message = 'zero results';
            this.warning = true;
          }
        });
    }
  }

  // Sets the marker & the info window.
  setMarker(latLng: google.maps.LatLng, title: string, content: string) {
    this.maps.deleteMarkers();
    // Sets the marker.
    this.position = latLng;

    //this.positions.push(this.position);

    this.title = title;
    // Sets the info window.
    this.content = content;
  }

  loadCity() {
   // Make the HTTP request:
   this.http.get(this.API_URL+'/Cities/findAll').subscribe(data => {
    // Read the result field from the JSON response.
    var i = 0;
    for(i = 0; i < data['result'].length; i++) {
      this.cities.push( new City(data['result'][i]['code'], data['result'][i]['lng'], data['result'][i]['lat'], data['result'][i]['name']) );

      this.citiesAutoComplete.push(data['result'][i]['name']);
    }
  });
}

  callCity(value) {
  
    let v = 0;
    this.cities.forEach(element => {
      if(element.name === value) {
        v = element.code;
      }
    });

    if (v !== 0) {
      // Make the HTTP request:
          this.http.get(this.API_URL+'/Cities/find?by=code&value=' + v).subscribe(data => {
          this.selectedCity = v;
          this.selectedNeighborhood = 0;
          this.selectedCityName = value;

          
          // Read the result field from the JSON response.
          this.center = new google.maps.LatLng(data['city'][0]['lat'], data['city'][0]['lng']);
          this.setMarker(this.center, data['city'][0]['name'], data['city'][0]['name']);
          this.zoom = 13;
          this.loadNeibrhoodByCityCode(v);
      });
    }
  }

  loadNeibrhoodByCityCode(code) {
    // Make the HTTP request:
    this.http.get(this.API_URL+'/Cities/Neighborhood/find?by=city&value='+ code).subscribe(data => {
      // Read the result field from the JSON response.
      this.neighborhoods = [];
      this.neighborhoodsAutoComplete.splice(this.neighborhoods.length);

      if (data['neighborhoods'].length > 0) {
        this.cityHasNeighborhoods = true;
        $('#neighborhoodBox').show();
      }
      else {
        this.cityHasNeighborhoods = false;
        $('#neighborhoodBox').hide();
      }

      this.autoClean = '';
      this.openBasicActions();


      var i = 0;
      for(i=0; i < data['neighborhoods'].length; i++) {
        this.neighborhoods.push(
          new Neighborhood(
            data['neighborhoods'][i]['neighborhood_code'],
            data['neighborhoods'][i]['lng'],
            data['neighborhoods'][i]['lat'],
            data['neighborhoods'][i]['name'],
            data['neighborhoods'][i]['city_code']
          ));

          this.neighborhoodsAutoComplete.push(data['neighborhoods'][i]['name']);
      }

    });

  }

  callNeighborhood(value) {

    let v = 0;
    this.neighborhoods.forEach(element => {
      if(element.name === value) {
        v = element.neighborhood_code;
      }
    });

    if (v !== 0) {
      this.selectedNeighborhood = v;
      this.openBasicActions();

      this.http.get(this.API_URL+'/Cities/Neighborhood/find?by=n&value='+v).subscribe(data => {

        this.center = new google.maps.LatLng(data['neighborhood'][0]['lat'], data['neighborhood'][0]['lng']);
        this.setMarker(this.center, data['neighborhood'][0]['name'], data['neighborhood'][0]['name']);
        this.zoom = 15;
      });
    }
  }


openBasicActions() {
  if (this.selectedCity !== 0 && this.cityHasNeighborhoods === false ) {
    this.basicActionsActive = true;
  }
  else {
    if  (this.selectedNeighborhood !== 0) {
      this.basicActionsActive = true;
    } else {  this.basicActionsActive = false; }
  }
}


  SaveDira() {
      
    
    this.entranceDate = $( "#entranceDate" ).datepicker( "getDate" );
    

          this.dira = new Dira(this.street, this.rooms, this.area, this.arnona, this.price, this.baal, this.phone, this.email, this.selectedCity, this.houseNumber, this.floor, this.entranceDate, this.type, new Location(this.user_lng, this.user_lat), this.selectedNeighborhood, '');

          this.http.post(this.API_URL+'/Properties/new', this.dira).subscribe(
      (responce) => {
        console.log(this.dira);
       console.log(responce)

       if (responce['status'] === 'success') {

         // display step 4
          this.progress = 95;
          this.currentStep++;
          this.leftMovePosition = -401;
          
          this.flatForm.reset();      
       }

        else {
          if (responce['message'] === 'Incorrect address') {
            this.noty.next({type:"warning", mess: "Adrres is incorrect please check again"});
          }

        }

     },
      (error) => console.log(error)
    );
  }


  startSearchDirot() {
    let code = 0;
    if (this.selectedCity!==0){
      code=this.selectedCity;
    }
    if (this.selectedNeighborhood !== 0) {
        code = this.selectedNeighborhood;
    }
    

    this.http.get(this.API_URL+'/Properties/find?code='+code).subscribe(data => {
    // Read the result field from the JSON response.

    this.dirot = [];
     this.misparDirot = 0;

    if (data["status"] === "failure") {
      this.searchDirot = false;
      this.noty.next({type:"warning", mess:"No dirot are found for your request"});
  
    }

    

    else {
      this.searchDirot = true;

      let i = 0;
      for(i = 0; i < data['result'].length; i++) {
        this.dirot.push( 
          new Dira(
          data['result'][i]['street'],
          data['result'][i]['rooms'], 
          data['result'][i]['area'],
          data['result'][i]['arnona'],
          data['result'][i]['pricePerMonth'],
          'test',
          '05299988777', 
          'mail@test.com',
          data['result'][i]['city_code'], 
          data['result'][i]['houseNumber'],
          data['result'][i]['floor'],
          data['result'][i]['entranceDate'],
          data['result'][i]['type'],
          new Location(data['result'][i]['location']['lat'], data['result'][i]['location']['lng']), data['result'][i]['neighborhood_code'], ''),
           );

        // this.positions.push(new google.maps.LatLng(data['result'][i]['location']['lat'], data['result'][i]['location']['lng']));

        // display on a google map
        let adress = this.dirot[i].street + ' ' + this.dirot[i].houseNumber;
        let info = '<table class="table table-striped table-condensed" style="font-size:16px;">	<thead>	<tr> <th class="success">' + adress + '</th></tr> </thead> <tbody> <tr>    <td> Price: </td><td>'
         + this.dirot[i].pricePerMonth
         + '₪/month</td></tr><tr class="active"><td> Arnona: </td> <td>' 
         + this.dirot[i].arnona 
         + '₪</td></tr><tr class="active"> <td> Rooms: </td> <td>' 
         + this.dirot[i].rooms
         + '</td></tr><tr class="active"><td>  Area:</td><td>'
         + this.dirot[i].area
         + 'm<sup>2</sup></td></tr> <tr class="active"><td>Floor: '
         + this.dirot[i].floor
         + '</td><td> <tr class="active"><td>Type:'
         + this.dirot[i].type
         + '</td></tr></tbody></table>';


        this.maps.addMarker(new google.maps.LatLng(data['result'][i]['location']['lat'], data['result'][i]['location']['lng']), adress, info);
      }
      this.misparDirot = data['result'].length;
      

    }
  });

    
  }

  closeSearchDirot() {
    this.searchDirot = false;
  }


  closeModal() {
     $('.shadow, .modal').fadeOut(); 
        this.currentStep = 0;
        this.progress = 0;
        this.leftMovePosition = -0;

        this.flatForm.reset();
}
  
  startSteps() {  if (this.userLoggedin) {
     $('.shadow, .step0').fadeIn(); 
    }
  }

  openContact() { $('.shadow, .contacts').fadeIn(); }

  exit() {
    this.userEmail = '';
    this.userLoggedin = false;
    $('.usermenu').hide();

    this.deleteCookie("gUsername");
    this.deleteCookie("gEmail");
    this.deleteCookie("gPassword");

    this.deleteCookie("rEmail");
    this.deleteCookie("rPassword");
    this.deleteCookie("risAdmin");

  }

  openLogin() {
    if (this.userLoggedin) {

      if(!this.userOpenSwitch) {
        $('.usermenu').show();
        this.userOpenSwitch = true;
      }
      else {
        $('.usermenu').hide();
        this.userOpenSwitch = false;
      }

    }

    else {
      $('.shadow, .loginBlocks').fadeIn();
    }
  }

  openManagePropertyApprove() {
    if (this.userLoggedin) {
      this.manage_switch_load = true;
      this.manage_property_control = 'new';
      $('.usermenu').hide();
      $('.manageProperty, .shadow').fadeIn();
    }
  }

  openManagePropertyRemove() {
    if (this.userLoggedin) {
      this.manage_switch_load = true;
      this.manage_property_control = 'all';
      $('.usermenu').hide();
      $('.manageProperty, .shadow').fadeIn();
    }
  }

  getPropertyType(v) { this.type = v;}

  openNoty(notyObj) { this.noty.next(notyObj); }
    

  validateFlatForm(form: NgForm) {
    switch (this.currentStep) {
      case 0: {  
          this.progress = 10;
          this.leftMovePosition = -100;
          this.currentStep++; 
          this.getCurrentPosition();
      break;
      }

      case 1: {
        if (form.controls.step1.valid) {
              this.progress = 40;
              this.leftMovePosition = -201;
              this.currentStep++;
        }
        else {
          this.noty.next({type:"warning", mess:"Please fill all fields correct"});
        }
        break;
      }

      case 2: {
        if (form.controls.step2.valid) {

          
            if (this.arnona <= 0) {
              this.noty.next({type:"warning", mess:"The arnona can not be 0 or negative"});
            } 

            else if(this.price <= 0) {
              this.noty.next({type:"warning", mess:"The price can not be negative number or 0"});
            }
            else {
              this.progress = 75;
              this.leftMovePosition = -301;
              this.currentStep++;
            }
        }
        else {
          this.noty.next({type:"warning", mess:"Please fill all fields correct"});
        }
      break;
      }

      case 3: {
        if (form.controls.step3.valid) {

            if (this.houseNumber <= 0) {
              this.noty.next({type:"warning", mess:"The fields can not be 0 or lover"});
            }
            else if(this.area <= 0) {
              this.noty.next({type:"warning", mess:"The arnona can not be negative number or 0"});
            }
            else if(this.rooms <= 0) {
              this.noty.next({type:"warning", mess:"The rooms number can not be negative number or 0"});
            }
            else if(this.floor < 0) {
              this.noty.next({type:"warning", mess:"The floor number can not be negative number"});
            }

        }
        else {
          this.noty.next({type:"warning", mess:"Please fill all fields correct"});
        }
      break;
      }

      default: {
        this.currentStep = 0;
        this.progress = 0;
        this.leftMovePosition = -0;
      }

    }
    
  }


  backTrackFlatForm(form: NgForm) {
    switch (this.currentStep) {
      case 1: {
        this.progress = 0;
        this.leftMovePosition = 0;
        this.currentStep--;
      break;
      }

      case 2: {
        this.progress = 10;
        this.leftMovePosition = -100;
        this.currentStep--;
      break;
      }

      case 3: {
        this.progress = 40;
        this.leftMovePosition = -201;
        this.currentStep--;
      break;
      }

      default: {
        this.currentStep = 0;
        this.progress = 0;
        this.leftMovePosition = 0;
      }

    }
    
  }

 
  setLogin(login) { 
    this.userLoggedin = login.status;
    this.email = login.email;
    this.userEmail = login.email;
    this.userisAdmin = login.isAdmin;
   


    this.globalUser = {email: login.email, password: login.password};

   }

   addNewCity() {
     $(".shadow, .addNewCityNeibrhood").fadeIn();
     this.addFormControl = 'city';
   }

    addNewNeighborhood() {
     $(".shadow, .addNewCityNeibrhood").fadeIn();
     this.addFormControl = 'neighborhood';
   }

   openCityBox() {
     $(".shadow, .infoBoxCN").fadeIn();
   }

  
}
