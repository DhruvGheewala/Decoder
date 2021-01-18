import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  constructor(public _userService: UserService) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }
  ngOnInit(): void {
  }

  get userName() {
    return this.loginForm.get('username');
  }
  get userPass() {
    return this.loginForm.get('password');
  }
  loginUser() {
    if (!this.loginForm.valid) {
      return;
    }
    let userData = this.loginForm.value;
    userData["method"] = "local";
    this._userService.loginUser(userData);
  }
}
