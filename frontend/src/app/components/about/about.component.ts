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
      info: "I am competitive coder. I go by name Dhruv_Gheewala on most of the competitive platforms. I like problem solving. Valar Morghulis",
      // info: [
      //   "- Student at DDU, Nadiad",
      //   "- Competitive coder",
      // ],
      github: "https://github.com/DhruvGheewala",
      linkedin: "https://www.linkedin.com/in/dhruvgheewala/",
      instagram: "https://www.instagram.com/dhruvgheewala1320/",
      img: "../../../assets/images/dhruv_gheewala.jpg",
    },
    {
      name: "Dhiraj Govindvira",
      info: "Hey there! I am competitive programmer and i enjoy problem solving alot! I am huge fan of tmkoc.",
      linkedin: "https://www.linkedin.com/in/dhiraj-govindvira/",
      github: "https://github.com/Dhiraj-01",
      instagram: "https://www.instagram.com/dhiraj_1_11/",
      img: "../../../assets/images/dhiraj-01.jpg",
    },
    {
      name: "Kushal Pandya",
      info: "I'm a competitive programmer enjoying life. I love cats, animes, tmkoc, and C++.",
      linkedin: "https://www.linkedin.com/in/kushal-pandya-630540173/",
      github: "https://github.com/kushalp13",
      instagram: "https://www.instagram.com/kushal.p13/",
      img: "../../../assets/images/kushal_pandya.jpg",
    }
  ];

  ngOnInit(): void {
  }

}
