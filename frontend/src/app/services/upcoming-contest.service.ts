import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpcomingContestService {

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(
    private http: HttpClient
  ) { }

  private urls = [
    'https://www.kontests.net/api/v1/sites',
    'https://www.kontests.net/api/v1/all'
  ]
  getUpcommingContestData(): Observable<any> {
    return this.http.get<any>(this.urls[1]);
  }
}
