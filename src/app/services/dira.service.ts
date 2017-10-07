import {Injectable} from '@angular/core';
//import {Http, Headers} from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Dira} from '../dira.model';

@Injectable()
export class DiraService {
  constructor (private http: HttpClient) {}
    saveDira(dira: Dira) {
      // const headers = new HttpHeaders();
      // headers.append('Content-Type', 'application/json');


      return this.http.post('https://server.dayar.net/Properties/new', dira);

      // return this.http.post('https://angular-learn-d6372.firebaseio.com/data.json', dira);

    

      // return this.http.post('https://angular-learn-d6372.firebaseio.com/data.json', dira, {headers: headers});
    }

}
