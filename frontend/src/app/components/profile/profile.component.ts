import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: string = null;
  constructor(
    private userData: UserService,
    private route: ActivatedRoute
  ) {
    this.user = route.snapshot.params.user;
  }

  ngOnInit(): void {
    console.log(this.user);
  }
}
