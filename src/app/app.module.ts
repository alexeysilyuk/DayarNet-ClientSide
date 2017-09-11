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

import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import {DiraService} from './services/dira.service';

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
        HeaderComponent,
        GoogleMapDirective,
        GoogleMapMarkerDirective,
        HomeComponent,
        ContactUsComponent
    ],
    providers: [
        MapsService,
        GeolocationService,
        GeocodingService,
        DiraService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
