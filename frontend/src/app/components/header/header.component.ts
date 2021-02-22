import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userData = {}
  title: string = "</Decoder>";
  brandClass: string = "navbar-brand text-warning";
  colorClass: string[] = ["text-primary", "text-success", "text-danger", "text-warning", "text-info"];
  username = "";
  constructor(public _userService: UserService) { }

  ngOnInit(): void { 
    this.username = this._userService.currentUser;
  }

  /**
  * Returns a random integer between min (inclusive) and max (inclusive).
  */
  rnd(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  brandHover() {
    this.brandClass = "navbar-brand " + this.colorClass[this.rnd(0, this.colorClass.length - 1)];
  }
  logout() {
    this._userService.doLogout();
  }
}
