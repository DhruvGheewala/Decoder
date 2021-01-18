import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string = 'http://localhost:3000/api';

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  // api request url at backend
  private authUrl: string = 'http://localhost:3000/auth';

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

  curUser = { userData: { username: "" } };
  constructor(private http: HttpClient, public router: Router) { }

  getLanguage() {
    return this.choosen.language;
  }
  // Todo: update in sevrer
  setLanguage(language: String) {
    this.choosen.language = language;
  }
  getTheme() {
    return this.choosen.theme;
  }
  // Todo: update in server
  setTheme(theme: string) {
    this.choosen.theme = theme;
  }

  // API Calls
  getAllUser(type: string, val: any): Observable<any> {
    let existingUser: Observable<any>;
    this.http.get<any>(this.authUrl + '/getAllUsernames').subscribe((data) => {
      existingUser = data.result;
      return existingUser;
    });
    return existingUser;
  }

  signupUser(data: any): Observable<any> {
    return this.http.post<any>(this.authUrl + '/signup', data);
  }

  loginUser(data: any) {
    return this.http.post<any>(this.authUrl + '/signin', data).subscribe((res: any) => {
      localStorage.setItem('access_token', res.result.token);
      this.curUser = res.result;
      console.log(this.curUser);
      this.currentUser = this.curUser.userData;
      this.router.navigate(['/']);
    });
  }
  itemValue = new Subject<string>();
  get userData(): JSON {
    return JSON.parse(localStorage.getItem('userData'));
  }
  set currentUser(data: any) {
    console.log(data);
    this.itemValue.next(data);
    localStorage.setItem('userData', JSON.stringify(data));
    localStorage.setItem('currentUserName', data.username);
  }
  get currentUser() {
    return localStorage.getItem('currentUserName');
  }
  getToken() {
    return localStorage.getItem('access_token');
  }
  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }
  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    let removeUser = localStorage.removeItem('currentUser');
    if (removeToken == null && removeUser == null) {
      this.router.navigate(['/login']);
    }
  }
  verifyToken(token: string) {
    var obj = {
      token: token
    }
    this.http.post<any>(this.authUrl + '/verify-email', obj).subscribe((res) => {
      if (!res.err) {
        alert("Email verified!");
        this.router.navigate(['/login']);
      } else {
        alert("Invalid token or token expired!");
      }
    });
  }
  compileRun(data): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/code/compile', data);
  }
  getAllPublicCodes(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/code/all');
  }
  getCodeById(id: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/code/view/public/' + id);
  }
  getCodeByUser(user: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/code/view/' + user);
  }
  saveCode(data): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/code/save', data);
  }
  getDefaultTemplates(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/code/defaults');
  }
  deleteCodeById(id: string): Observable<any> {
    return this.http.delete<any>(this.apiUrl + `/code/delete/${id}`);
  }
}