import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from "src/app/service/user.service";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-code-user',
  templateUrl: './code-user.component.html',
  styleUrls: ['./code-user.component.css']
})
export class CodeUserComponent implements OnInit, AfterViewInit {

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) { this.user = route.snapshot.params.user; }

  user: null;
  prvBtn = null;
  languages = ["All", "C", "C++", "Java", "Python", "Javascript"];
  all_codes = undefined;
  copy_all_codes = null;
  loadingMsg = '';
  codes_by_lang = {};

  ngOnInit(): void {
    this.loadingMsg = 'Fetching your codes...';
    this.spinner.show();

    console.log(this.user);
    this.userService.getCodesByUser(this.user).subscribe((data) => {
      console.log(data);
      this.all_codes = this.copy_all_codes = data.result;

      this.sortByDate(this.all_codes);
      this.codes_by_lang = {};
      this.languages.forEach(lang => {
        this.codes_by_lang[lang] = [];
      });
      this.codes_by_lang["All"] = this.all_codes;
      this.all_codes.forEach(code => {
        this.codes_by_lang[code.language].push(code);
      });

      if (environment.production) {
        this.spinner.hide();
      } else {
        setTimeout(() => this.spinner.hide(), 2000);
      }
    });
  }

  ngAfterViewInit() {
    let btn = document.getElementById('All');
    if (btn) {
      btn.click();
    }
  }

  sortByDate(codes) {
    codes.sort((a, b) => {
      return new Date(b.time).valueOf() - new Date(a.time).valueOf();
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
