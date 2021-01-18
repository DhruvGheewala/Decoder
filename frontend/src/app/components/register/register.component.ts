import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { debounce, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { UserService } from 'src/app/service/user.service';

const validateuser = (httpClient: HttpClient, type: string) => (c: FormControl) => {

  if (!c || String(c.value).length === 0) {
    return of(null);
  }
  const val = c.value;

  return httpClient
    .get('http://localhost:3000/auth/getAllUsernames')
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
    public router: Router
  ) {
    this.signupForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ], [validateuser(this.httpClient, 'username')]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ], [validateuser(this.httpClient, 'email')]),
      password: new FormControl('', [
        Validators.required,
      ]),
      repassword: new FormControl('', [
        Validators.required,
        mustMatch('password')
      ])
    });
  }

  ngOnInit(): void {
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
      return;
    }
    let userdata = this.signupForm.value;
    userdata["method"] = "local";
    userdata["id"] = "";
    this._userService.signupUser(this.signupForm.value).subscribe((res) => {
      if (res.err) {
        alert(res.err);
      } else {
        alert(res.result);
        this.router.navigate(['login']);
      }
    })
  }

  signUpGoogle() {

  }

}
