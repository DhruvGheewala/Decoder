import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouteConfigLoadEnd } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild("code") codeEle: ElementRef;
  public Token: any;
  constructor(public route: ActivatedRoute, public _userService: UserService) {
    this.Token = this.route.snapshot.queryParamMap.get('token');
  }

  title: string = "</Decoder>";
  default_code: string = `
<span class="text-danger">While</span>(alive)
{
    <span style="color: #33C9FF">eat</span>();
    <span style="color: #33C9FF">code</span>();
    <span style="color: #33C9FF">sleep</span>();
    <span style="color: #33C9FF">repeat</span>();
}
`;

  ngOnInit(): void {
    if (this.Token != null) {
      console.log(this.Token);
      this._userService.verifyToken(this.Token);
    }
  }

  ngAfterViewInit() {
    this.codeEle.nativeElement.innerHTML = this.default_code;
  }
}
