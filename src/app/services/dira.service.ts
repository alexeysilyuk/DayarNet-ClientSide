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
      // headers.append('Allow-Control-Allow-Origin', 'http://localhost:4200');

      return this.http.post('http://localhost:8080/Properties/new', dira);

      // return this.http.post('https://angular-learn-d6372.firebaseio.com/data.json', dira);

     // return this.http.post('http://localhost:8080/Properties/new/data.json', dira, {headers: headers});

      // return this.http.post('https://angular-learn-d6372.firebaseio.com/data.json', dira, {headers: headers});
    }

}
