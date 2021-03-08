import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username: string = null;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.username = route.snapshot.params.user;
  }

  ngOnInit(): void {
    // console.log(this.user);
  }
}
