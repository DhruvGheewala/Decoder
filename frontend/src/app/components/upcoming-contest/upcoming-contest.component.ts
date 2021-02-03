import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-upcoming-contest',
  templateUrl: './upcoming-contest.component.html',
  styleUrls: ['./upcoming-contest.component.css']
})
export class UpcomingContestComponent implements OnInit {

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  private urls = [
    'https://www.kontests.net/api/v1/sites',
    'https://www.kontests.net/api/v1/all'
  ];

  prvBtn = null;
  sites: Set<string>;
  loadingMsg = '';
  allData = null;
  copyAllData1 = null; // copy of all data receive from api
  copyAllData2 = null; // copy of allData variable => used for search
  languages = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.loadingMsg = 'Fetching the contest data';
    this.spinner.show();

    try {
      this.http.get<any>(this.urls[1]).subscribe((data) => {
        this.allData = this.copyAllData1 = data;
        this.copyAllData2 = this.allData;
        this.sites = new Set();
        data.forEach(d => this.sites.add(d.site));

        document.getElementById('All').click();
        this.spinner.hide();
        // setTimeout(() => this.spinner.hide(), 5000);
      });
    } catch (err) {
      this.router.navigate(['/error']);
    }
  }

  getSiteData(event) {
    this.loadingMsg = 'Fetching the contest data';
    this.spinner.show();

    let classNames = ["btn-dark"];
    if (this.prvBtn) {
      classNames.forEach(c => {
        let className = this.prvBtn.className;
        let ind = className.indexOf(c);
        if (ind >= 0) {
          let newClassName = className.substring(0, ind) + className.substring(ind + c.length);
          this.prvBtn.className = newClassName;
        }
      });
    }
    this.prvBtn = event.toElement;
    classNames.forEach(c => this.prvBtn.className += ` ${c}`);

    let site = event.target.outerText;

    if (site === 'All') {
      this.allData = this.copyAllData1;
      this.copyAllData2 = this.allData;
    }
    else {
      this.allData = [];
      this.copyAllData1.forEach(data => {
        if (data.site === site) {
          this.allData.push(data);
        }
      });
      this.copyAllData2 = this.allData;
    }
    this.spinner.hide();
  }

  filter(query: string) {
    query = query.toLowerCase().trim();
    let terms: string[] = query.split(' ');

    let searchData = [];
    this.copyAllData2.forEach(b => {
      let cnt: number = 0;
      terms.forEach(term => {
        if (b.name.toLowerCase().includes(term) || b.site.toLowerCase().includes(term)) {
          cnt++;
        }
      });
      if (cnt) {
        searchData.push({ data: b, cnt });
      }
    });
    searchData.sort((x, y) => {
      return (y.cnt - x.cnt);
    });
    this.allData = [];
    searchData.forEach(contest => {
      this.allData.push(contest.data);
    });
  }

  /**
   * Returns a human readable format of date
   */
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

  /**
   * Returns string according to given duration(second)
   * @param time Time in seconds
   */
  secondToHumanReadable(sec: number) {
    let seconds: number = <number><unknown>(sec / 1).toFixed(1);
    let minutes: number = <number><unknown>(sec / (60)).toFixed(1);
    let hours: number = <number><unknown>(sec / (60 * 60)).toFixed(1);
    let days: number = <number><unknown>(sec / (60 * 60 * 24)).toFixed(1);
    let years: number = <number><unknown>(sec / (60 * 60 * 24 * 365)).toFixed(1);

    if (seconds < 60) {
      return `${seconds} Sec`;
    } else if (minutes < 60) {
      return `${minutes} Min`;
    } else if (hours < 24) {
      return `${hours} Hrs`;
    } else if (days < 365) {
      return `${days} Day`;
    } else {
      return `${years} Yrs`;
    }
  }

  /**
   * Returns google calendar link according to given data
   * @param data 
   */
  getCalendarLink(data): string {
    const normalizeDate = (date: string) => { return date.split('-').join('').split(':').join('').split('.').join(''); };
    const stime = normalizeDate(data.start_time);
    const etime = normalizeDate(data.end_time);

    let res: string = 'https://calendar.google.com/event?action=TEMPLATE';
    res += `&dates=${stime}/${etime}`;
    res += `&text=${encodeURIComponent(data.name)}`;
    res += `&location=${data.url}`;
    return res;
  }
}