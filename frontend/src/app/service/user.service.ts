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
  private defaultMode = 'C++';  // caption of language
  private defaultTheme = 'monokai';

  // Todo: Fetched From server (fetch user's all data not only mode and theme)
  private userPreferedMode = undefined;
  private userPreferedTheme = undefined;

  private choosen = {
    mode: this.userPreferedMode || this.defaultMode,
    theme: this.userPreferedTheme || this.defaultTheme
  };

  constructor(private http: HttpClient) { }

  getMode() { return this.choosen['mode']; }
  // Todo: update in sevrer
  setMode(mode: String) { this.choosen['mode'] = mode; }

  getTheme() { return this.choosen['theme']; }
  // Todo: update in server
  setTheme(theme: string) { this.choosen['theme'] = theme; }

  // Todo: Fetch from server
  getCodes(): any {
    return [
      {
        caption: 'Dijkstra',
        link: 'xyz'
      },
      {
        caption: 'Prims MST',
        link: 'pyz'
      },
      {
        caption: 'Disjoint-Set-Union',
        link: 'pyr'
      },
      {
        caption: '0/1 Knapsack-DP',
        link: 'xyr'
      },
      {
        caption: 'Graham Scan',
        link: 'xqz'
      },
      {
        caption: 'Ford-Fulkerson Flow',
        link: 'pqr'
      },
      {
        caption: 'Bellmen-Ford',
        link: 'xqr'
      }
    ];
  }

  private compileUrl = `${this.apiUrl}/code/compile`;
  compileRun(data) { return this.http.post<any>(this.compileUrl, data); }

  getAllPublicCodes(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/code/all');
  }
  getCodeById(id: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/code/view/public/' + id);
  }
  saveCode(data): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/code/save', data);
  }
}
