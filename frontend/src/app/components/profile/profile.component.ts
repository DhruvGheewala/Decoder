import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@full-fledged/alerts';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username: string = null;
  curUser:any = "";
  edit:any = false;
  label:string = "Edit Profile";
  @ViewChild('inputName', { static: true }) private inputNameElemRef: ElementRef;
  @ViewChild('inputBio', { static: true }) private inputBioElemRef: ElementRef;
  constructor(
    public router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private _alertService: AlertService
  ) {
    this.username = route.snapshot.params.user;
  }

  ngOnInit(): void {
    let data = {};
    data["username"] = this.route.snapshot.params.user
    this.userService.getUserInfo(data).subscribe((data)=> {
      this.curUser = data.result;
    }, err => {
      this._alertService.warning(err.error.err);
      this.router.navigate(['/']);
    });
  }

  isSameAuthor() {
    // console.log("Login : ", this.userService.currentUser);
    // console.log("Author : ", this.username);
    return this.userService.currentUser === this.username;
  }
  turnOnEdit() {
    if(this.label === "Edit Profile"){
      this.label = "Cancel Edit"; 
    }else{
      this.label = "Edit Profile"; 
    }
    this.edit = !this.edit;
  }
  update(name:any, bio:any) {
    let data = {};
    data["username"] = this.username;
    data["fullname"] = name;
    data["bio"] = bio;
    this.userService.updateUser(data);
    this.turnOnEdit();
    this._alertService.success("Profile updated!");
    window.location.reload();
  }
  isAdmin() {
    let name = this.username;
    if(name === "Dhruv_Gheewala" || name === "dhiraj-01" || name === "kushal.p13") {
      return true;
    }
    return false;
  }
}
