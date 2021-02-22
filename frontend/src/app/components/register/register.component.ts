import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { UserService } from 'src/app/service/user.service';
import { environment } from 'src/environments/environment';
import {AlertService} from '@full-fledged/alerts';

declare var $: any;
const invalidPassword = () => (c: FormControl) => {
  if(!c || String(c.value).length === 0) {
    return of(null);
  }
  const val = c.value;

  const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
  const valid = regex.test(val);
  return valid ? null : {invalidPassword : true};
}
const validateuser = (httpClient: HttpClient, type: string) => (c: FormControl) => {

  if (!c || String(c.value).length === 0) {
    return of(null);
  }
  const val = c.value;

  return httpClient
    .get(`${environment.server}/auth/getAllUsernames`)
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((data: any) => {
        let existingUser = data.result;
        for (var _id in existingUser) {
          var obj = existingUser[_id];
          for (var prop in obj) {
            if (type === "email" && prop === "email" && obj[prop] === val) {
              return { validateuser: true };
            } else if (type === "username" && prop === "username" && obj[prop] === val) {
              return { validateuser: true };
            }
          }
        }
        return null;
      })
    );
};
const mustMatch = (matchWith: string) => (control: FormControl) => {
  if (!control || !control.parent) {
    return null;
  }
  const val1 = control.value;
  const val2 = control.parent.get(matchWith).value;
  return (val1 === val2) ? null : { mustMatch: true };
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  signupForm: FormGroup;
  exist: any;

  constructor(
    public fb: FormBuilder,
    private _userService: UserService,
    public httpClient: HttpClient,
    public router: Router,
    public _alertService: AlertService
  ) {
    // this._alertService.success("welcome!");
    this.signupForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^(?=.{3,20}$)(?![_.-])[a-zA-Z0-9._-]+(?<![_.])$')
      ], [validateuser(this.httpClient, 'username')]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ], [validateuser(this.httpClient, 'email')]),
      password: new FormControl('', [
        Validators.required,
        invalidPassword()
      ]),
      repassword: new FormControl('', [
        Validators.required,
        mustMatch('password')
      ])
    });
  }

  ngOnInit(): void {
    $('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    });
  }

  get userName() {
    return this.signupForm.get('username');
  }
  get userEmail() {
    return this.signupForm.get('email');
  }
  get userPass() {
    return this.signupForm.get('password');
  }
  get rePass() {
    return this.signupForm.get('repassword');
  }

  signUpLocal() {
    if (!this.signupForm.valid) {
      console.log("user form is invalid!");
      return;
    }
    let userdata = this.signupForm.value;
    userdata["method"] = "local";
    userdata["id"] = "";
    this._userService.signupUser(this.signupForm.value).subscribe((res) => {
      if (res.err) {
        // alert(res.err);
        this._alertService.danger("Server Error Occured!");
      } else {
        this._alertService.success(res.result);
        this.router.navigate(['login']);
      }
    })
  }

  signUpGoogle() {

  }

}
