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
}
