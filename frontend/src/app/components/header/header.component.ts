import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title: string = "</Decoder>";
  brandClass: string = "navbar-brand text-warning";
  colorClass: string[] = ["text-primary", "text-success", "text-danger", "text-warning", "text-info"];
  constructor() { }
  ngOnInit(): void {
  }
  brandHover() {
    let id = Math.floor((Math.random() * 5) + 1) - 1;
    console.log(id);
    this.brandClass = "navbar-brand " + this.colorClass[id];
    console.log(this.brandClass);
  }

}
