import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';

@Component({
  selector: 'app-code-user',
  templateUrl: './code-user.component.html',
  styleUrls: ['./code-user.component.css']
})
export class CodeUserComponent implements OnInit {

  constructor(private adminService: AdminService) { }

  languages = [];
  ngOnInit(): void {
    let lang = this.adminService.getLanguages();
    this.languages.push(lang["C"]["caption"]);
    this.languages.push(lang["C++"]["caption"]);
    this.languages.push(lang["Java"]["caption"]);
    this.languages.push(lang["Python"]["caption"]);
    this.languages.push(lang["Javascript"]["caption"]);
  }
}
