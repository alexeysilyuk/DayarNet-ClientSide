import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GoogleMapDirective } from '../app/directives/google-map.directive';
import { GoogleMapMarkerDirective } from '../app/directives/google-map-marker.directive';

import { MapsService } from '../app/services/maps.service';
import { GeolocationService } from '../app/services/geolocation.service';
import { GeocodingService } from '../app/services/geocoding.service';

import { AppComponent } from './app.component';

import {HttpClientModule} from '@angular/common/http';
import { HttpModule } from '@angular/http';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpModule,
        HttpClientModule
    ],
    declarations: [
        AppComponent,
        GoogleMapDirective,
        GoogleMapMarkerDirective
    ],
    providers: [
        MapsService,
        GeolocationService,
        GeocodingService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
