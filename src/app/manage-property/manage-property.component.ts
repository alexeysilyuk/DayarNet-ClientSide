import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Dira} from '../dira.model';
import {Location} from '../location.model';

@Component({
  selector: 'app-manage-property',
  templateUrl: './manage-property.component.html',
  styleUrls: ['./manage-property.component.css']
})
export class ManagePropertyComponent implements OnInit {

  @Output() noty = new EventEmitter<{type:string, mess:string}>();

  @Input() controller: string = 'all';
  @Input() globalUser: {email: string, password: string};

  dirot: Dira[] = [];
  dirotNew: Dira[] = [];

  misparDirot = 0;
  misparNewDirot = 0;  

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadAllProperties();
  }


  loadAllProperties() {
    this.http.get('https://server.dayar.net/Properties/findAll').subscribe(data => {
      // Read the result field from the JSON response.
      
      this.dirot = [];
       this.misparDirot = 0;
  
      if (data["status"] === "failure") {
        this.noty.next({type:"error", mess:"No dirot are found for your request"});
  
      }
  
      else {
        let i = 0;
        for(i = 0; i < data['result'].length; i++) {

          let diraObj = new Dira(
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
            new Location(data['result'][i]['location']['lat'], data['result'][i]['location']['lng']), data['result'][i]['neighborhood_code'], data['result'][i]['id']);

          this.dirot.push(diraObj);
  
          
             if(data['result'][i]['status'] === "NEW") {
               this.dirotNew.push(diraObj);
               this.misparNewDirot++;
             }
        
        }
        this.misparDirot = data['result'].length;
  
      }
    });
  }


  approveProperty(id: string) {
      console.log(id);
      console.log(this.globalUser);

       this.http.post('https://server.dayar.net/admin/approveProperty?id='+id, this.globalUser).subscribe(
      (responce) => {

            if(responce['status'] === "success") {
              this.noty.next({type: "success", mess:""});

            }

            else {
              this.noty.next({type:"error", mess: "Status of your request "+responce['status']});
            }
      });
  }

}
