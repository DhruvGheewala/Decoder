import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string = 'http://localhost:3000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  // Defualt values

  // api request url at backend
  endpoint: string = 'http://localhost:3000/auth';

  //TODO: Default template of cpp.
  private defaultLanguage = 'C++';
  private defaultTheme = 'monokai';

  // Todo: Fetched From server (fetch user's all data not only mode and theme)
  private userPreferedLanguage = undefined;
  private userPreferedTheme = undefined;

  private choosen = {
    language: this.userPreferedLanguage || this.defaultLanguage,
    theme: this.userPreferedTheme || this.defaultTheme
  };

  constructor(private http: HttpClient) { }

  getLanguage() { return this.choosen.language; }
  // Todo: update in sevrer
  setLanguage(language: String) { this.choosen.language = language; }

  getTheme() { return this.choosen.theme; }
  // Todo: update in server
  setTheme(theme: string) { this.choosen.theme = theme; }

  private compileUrl = `${this.apiUrl}/code/compile`;
  compileRun(data) { return this.http.post<any>(this.compileUrl, data); }

  getAllPublicCodes(): Observable<any> { return this.http.get<any>(this.apiUrl + '/code/all'); }
  getCodeById(id: string): Observable<any> { return this.http.get<any>(this.apiUrl + '/code/view/public/' + id); }
  saveCode(data): Observable<any> { return this.http.post<any>(this.apiUrl + '/code/save', data); }
}