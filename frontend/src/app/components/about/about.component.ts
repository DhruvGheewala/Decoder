import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }
  public members = [
    {
      name: "Dhruv Gheewala",
      info: "Some example text some example text. John Doe is an architect and engineer",
      github: "https://github.com/DhruvGheewala",
      linkedin: "https://www.linkedin.com/in/dhruvgheewala/",
      img: "../../../assets/images/dhruv_gheewala.jpg",
    },
    {
      name: "Dhiraj Govindvira",
      info: "Some example text some example text. John Doe is an architect and engineer",
      linkedin: "https://www.linkedin.com/in/dhiraj-govindvira/",
      github: "https://github.com/Dhiraj-01",
      img: "../../../assets/images/dhiraj-01.jpg",
    },
    {
      name: "Kushal Pandya",
      info: "Some example text some example text. John Doe is an architect and engineer",
      linkedin: "https://www.linkedin.com/in/kushal-pandya-630540173/",
      github: "https://github.com/kushalp13",
      img: "../../../assets/images/kushal_pandya.jpg",
    }
  ];

  ngOnInit(): void {
  }

}
