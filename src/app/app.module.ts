import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { AppComponent } from './map.component';
import { AgmCoreModule } from '@agm/core';
import {HttpClientModule} from '@angular/common/http';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
	HttpModule,
	HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCyXe6UaSkskcPJsuEABIsCHK9Nr1Z3dIU'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
