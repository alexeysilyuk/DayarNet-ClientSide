import { Component, OnInit } from '@angular/core';


import { GoogleMapDirective } from '../../app/directives/google-map.directive';
import { GoogleMapMarkerDirective } from '../../app/directives/google-map-marker.directive';

import { MapsService } from '../../app/services/maps.service';
import { GeolocationService } from '../../app/services/geolocation.service';
import { GeocodingService } from '../../app/services/geocoding.service';


import { HttpClient } from '@angular/common/http';

//import { Http, Headers } from '@angular/http';

import {City } from '../city.model';
import {Neighborhood } from '../neighborhood.model';
import {Dira} from '../dira.model';
import {DiraService} from '../services/dira.service';
import {and} from "@angular/router/src/utils/collection";

declare var $: any; // jQuery

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

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
  neighborhoods: Neighborhood[] = [];
  dirot: Dira[] = [];
  dira: Dira;

  // dira params
  street:'';
  rooms:number;
  area:number;
  arnona:number;
  price:number;
  baal:'';
  phone:'';
  email:'';


  selectedCity: number;
  selectedNeighborhood: number;

  cityHasNeighborhoods:boolean;


  componentDisplay = 'home';

  onNavigate(coponent: string) {
    this.componentDisplay = coponent;
  }

  constructor(public maps: MapsService, private geolocation: GeolocationService, private geocoding: GeocodingService, private http: HttpClient, private diraService: DiraService) {

    this.selectedCity = 0;
    this.selectedNeighborhood = 0;
    this.searchDirot = false;

    this.center = new google.maps.LatLng(41.910943, 12.476358);
    this.zoom = 4;

    // Other options.
    this.disableDefaultUI = true;
    this.disableDoubleClickZoom = false;
    this.mapTypeId = google.maps.MapTypeId.ROADMAP;
    this.maxZoom = 18;
    this.minZoom = 4;

    // Initially the marker isn't set.

    this.address = '';

    this.warning = false;
    this.message = '';

    // temp dirot
    this.dirot =  [
      new Dira('Jabotinski 145/45', 4, 90, 480, 2200, 'Avi', '050887896', 'avi@mail.com'),
      new Dira('Ayalon 225/13', 6, 190, 1480, 5000, 'Rony', '052887896', 'rony@mail.com'),
      new Dira('Jabotinski 145/45', 4, 90, 480, 2200, 'Avi', '050887896', 'avi@mail.com'),
      new Dira('Ayalon 225/13', 6, 190, 1480, 5000, 'Rony', '052887896', 'rony@mail.com')];
  }

  ngOnInit() {
    this.getCurrentPosition();
    this.loadCity();
  }


  getCurrentPosition() {
    this.warning = false;
    this.message = '';

    if (navigator.geolocation) {
      this.geolocation.getCurrentPosition().forEach(
        (position: Position) => {
          if (this.center.lat() !== position.coords.latitude && this.center.lng() !== position.coords.longitude) {
            // New center object: triggers OnChanges.
            this.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            this.zoom = 11;
            // Translates the location into address.
            this.geocoding.geocode(this.center).forEach(
              (results: google.maps.GeocoderResult[]) => {
                this.setMarker(this.center, 'your locality', results[0].formatted_address);
              }
            ).then(() => console.log('Geocoding service: completed.'));
          }
        }
      ).then(() => console.log('Geolocation service: completed.')).catch(
        (error: PositionError) => {
          if (error.code > 0) {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                this.message = 'permission denied';
                break;
              case error.POSITION_UNAVAILABLE:
                this.message = 'position unavailable';
                break;
              case error.TIMEOUT:
                this.message = 'position timeout';
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
    this.title = title;
    // Sets the info window.
    this.content = content;
  }

  loadCity() {
   // Make the HTTP request:
   this.http.get('http://localhost:8080/Cities/findAll').subscribe(data => {
    // Read the result field from the JSON response.
    var i = 0;
    for(i = 0; i < data['result'].length; i++) {
      this.cities.push( new City(data['result'][i]['code'], data['result'][i]['lng'], data['result'][i]['lat'], data['result'][i]['name']) );
    }
  });
}

  callCity(value) {
    // Make the HTTP request:
    this.http.get('http://localhost:8080/Cities/find?by=code&value=' + value).subscribe(data => {
        this.selectedCity = value;
        // Read the result field from the JSON response.
        this.center = new google.maps.LatLng(data['city'][0]['lat'], data['city'][0]['lng']);
        this.setMarker(this.center, data['city'][0]['name'], data['city'][0]['name']);
        this.zoom = 12;
        this.loadNeibrhoodByCityCode(value);
    });
  }

  loadNeibrhoodByCityCode(code) {
    // Make the HTTP request:
    this.http.get('http://localhost:8080/Cities/Neighborhood/find?by=city&value='+ code).subscribe(data => {
      // Read the result field from the JSON response.
      this.neighborhoods = [];

      if (data['neighborhoods'].length > 0) {
        this.cityHasNeighborhoods = true;
      }
      else {
        this.cityHasNeighborhoods = false;
      }

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
      }
    });

  }

  callNeighborhood(value) {
    this.selectedNeighborhood = value;
    this.openBasicActions();

    this.http.get('http://localhost:8080/Cities/Neighborhood/find?by=n&value='+value).subscribe(data => {

      this.center = new google.maps.LatLng(data['neighborhood'][0]['lat'], data['neighborhood'][0]['lng']);
      this.setMarker(this.center, data['neighborhood'][0]['name'], data['neighborhood'][0]['name']);
      this.zoom = 15;
    });

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


  saveDira() {
    this.dira = new Dira(this.street, this.rooms, this.area, this.arnona, this.price, this.baal, this.phone, this.email);
    this.diraService.saveDira(this.dira).subscribe(
      (responce) => console.log(responce),
      (error) => console.log(error)
    );
  }

  closeModal() {
    $('.step1, .step2, .step3').fadeOut();
    $('.shadow').fadeOut();
  }

  startSteps() {
    $('.shadow').fadeIn();
    $('.step1').fadeIn();
  }


  step2Start() {
    $('.step1').fadeOut();
    $('.step2').fadeIn();
  }

  step2Back() {
    $('.step2').fadeOut();
    $('.step1').fadeIn();
  }


  step3Start() {
    $('.step2').fadeOut();
    $('.step3').fadeIn();
  }

  step3Back() {
    $('.step3').fadeOut();
    $('.step2').fadeIn();
  }


  startSearchDirot() {
    this.searchDirot = true;
    // JSON send request
  }

  closeSearchDirot() {
    this.searchDirot = false;
  }
}
