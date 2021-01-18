import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string = 'http://localhost:3000/api';

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // window.alert(errorMessage);
    return {
      author: "Guest",
      content: "import java.util.*;↵import java.lang.*;↵import java.io.*;↵↵class Decoder↵{↵    static Scanner in;↵    public static void main(String[] args)↵    {↵        // your code goes here ...↵        in = new Scanner(System.in);↵        int x, y;↵        x = in.nextInt();↵        y = in.nextInt();↵        System.out.println(x + y);↵    }↵}",
      id: "6002ba78f4ee6a47e0d64af1",
      language: "Java",
      parent: null,
      stderr: "",
      stdin: "1 20",
      stdout: "21",
      time: "2021-01-16T10:05:44.398Z",
      title: "Two Sum",
      visibility: "public",
      __v: 0,
      _id: "6002ba78f4ee6a47e0d64af1",
    };
  }

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
  // Todo: User's choice isn't included yet
  getDefaultTemplates(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/code/defaults');
  }
  deleteCodeById(id: string): Observable<any> {
    return this.http.delete<any>(this.apiUrl + `/code/delete/${id}`);
  }
}