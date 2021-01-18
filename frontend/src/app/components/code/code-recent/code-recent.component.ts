import { Component, OnInit } from '@angular/core';
import { UserService } from "src/app/service/user.service";

@Component({
  selector: 'app-code-recent',
  templateUrl: './code-recent.component.html',
  styleUrls: ['./code-recent.component.css']
})
export class CodeRecentComponent implements OnInit {

  constructor(private userService: UserService) { }

  all_codes = null;
  copy_all_codes = null;

  ngOnInit(): void {
    this.userService.getAllPublicCodes().subscribe((data) => {
      this.all_codes = this.copy_all_codes = data.result;
      this.all_codes.sort((a, b) => {
        return new Date(b.time).valueOf() - new Date(a.time).valueOf();
      });
      if (this.all_codes.length >= 30) {
        this.all_codes.length = 30;
      }
    });
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
