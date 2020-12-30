import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string = 'http://localhost:8000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  // Defualt values
  private defaultMode = 'c_cpp';
  private defaultTheme = 'monokai';

  // Todo: Fetched From server
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
  getOutput(data) { return this.http.post<any>(this.compileUrl, data); }
}
