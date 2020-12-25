import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild("code") codeEle: ElementRef;
  constructor() { }

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
  }

  ngAfterViewInit() {
    this.codeEle.nativeElement.innerHTML = this.default_code;
  }
}
