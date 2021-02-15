import { Component, OnInit } from '@angular/core';

// Services
import { UserService } from "src/app/service/user.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AdminService } from 'src/app/service/admin.service';

@Component({
  selector: 'app-code-recent',
  templateUrl: './code-recent.component.html',
  styleUrls: ['./code-recent.component.css']
})
export class CodeRecentComponent implements OnInit {

  constructor(
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private adminService: AdminService
  ) { }

  prvBtn = null;
  languages = ["All", "C", "C++", "Java", "Python", "Javascript"];
  loadingMsg = '';
  all_codes = null;
  codes_by_lang = {};
  copy_all_codes = null;

  ngOnInit(): void {
    this.loadingMsg = 'Fetching Codes...';
    this.spinner.show();
    this.userService.getAllPublicCodes().subscribe((data) => {
      this.all_codes = this.copy_all_codes = data.result;
      this.all_codes.sort((a, b) => {
        return new Date(b.time).valueOf() - new Date(a.time).valueOf();
      });
      this.codes_by_lang = {};
      this.languages.forEach(lang => {
        this.codes_by_lang[lang] = [];
      });
      this.codes_by_lang["All"] = this.all_codes;
      this.all_codes.forEach(code => {
        this.codes_by_lang[code.language].push(code);
      });
      if (this.all_codes.length >= 30) {
        this.all_codes.length = 30;
      }
      this.spinner.hide();
      let btn = document.getElementById('All');
      if(btn) btn.click();
    });
  }

  searchByLang(e) {
    let classNames = ["btn-dark"];
    if (this.prvBtn) {
      classNames.forEach(c => {
        let className = this.prvBtn.className;
        let ind = className.indexOf(c);
        if (ind != -1) {
          let newClassName = className.substring(0, ind) + className.substring(ind + c.length);
          this.prvBtn.className = newClassName;
        }
      });
    }
    this.prvBtn = e.toElement;
    classNames.forEach(c => this.prvBtn.className += ` ${c}`);
    this.all_codes = this.codes_by_lang[e.toElement.innerText];
  }

  isLoogedIn() {
    return this.userService.isLoggedIn;
  }
  getUserName() {
    return this.userService.currentUser;
  }

  dateToHumanReadable(date) {
    date = new Date(date);

    let year = date.getFullYear();

    let month: any = date.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;

    let day: any = date.getDate();
    day = day < 10 ? `0${day}` : day;

    let hour: any = date.getHours();
    hour = hour < 10 ? `0${hour}` : hour;

    let minute: any = date.getMinutes();
    minute = minute < 10 ? `0${minute}` : minute;

    return `${day}-${month}-${year} at ${hour}:${minute}`;
  }

  filter(query: string) {
    query = query.toLowerCase().trim();
    let terms: string[] = query.split(' ');

    let searchData = [];
    this.copy_all_codes.forEach(b => {
      let ok: boolean = false;
      terms.forEach(term => {
        if (b.author.toLowerCase().includes(term) || b.language.toLowerCase().includes(term) || b.title.toLowerCase().includes(term)) {
          ok = true;
        }
      });
      if (ok) {
        searchData.push(b);
      }
    });
    this.all_codes = searchData;
  }
}
