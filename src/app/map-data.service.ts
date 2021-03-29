import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8000/api/v1';

@Injectable({
  providedIn: 'root'
})
export class MapDataService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<any> {
  	var mapdata = 'tn_state';
    return this.http.get <any>(`${baseUrl}/${mapdata}`);
  }
   getDistrict(): Observable<any> {
  	var mapdata = 'tn_district';
    return this.http.get <any>(`${baseUrl}/${mapdata}`);
  }
  getBlock(): Observable<any> {
    var mapdata = 'tn_blocks';
    return this.http.get <any>(`${baseUrl}/${mapdata}`);
  }
}
