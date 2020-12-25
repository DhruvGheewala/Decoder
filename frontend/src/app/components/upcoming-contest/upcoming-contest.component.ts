import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-upcoming-contest',
  templateUrl: './upcoming-contest.component.html',
  styleUrls: ['./upcoming-contest.component.css']
})
export class UpcomingContestComponent implements OnInit, AfterViewInit {

  @ViewChild("pill") pillElemRef: ElementRef;
  @ViewChild("siteData") siteDataElemRef: ElementRef;

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  private urls = [
    'https://www.kontests.net/api/v1/sites',
    'https://www.kontests.net/api/v1/all'
  ];

  pillElem = null;
  siteDataElem = null;

  allData = null;
  upcomingContestKeys = new Array();
  upcomingContestObject = {};
  hideSpinner: boolean = false;

  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    try {
      this.http.get<any>(this.urls[1]).subscribe((data) => {
        this.allData = data;
        this.updateContestData();
      });
    } catch (error) {
      // Todo: this.router.navigate, navigate to error component on api call error(kushal)
      document.location.href = '/error';
    }
  }

  ngAfterViewInit(): void {
    this.pillElem = this.pillElemRef.nativeElement;
    this.siteDataElem = this.siteDataElemRef.nativeElement;
  }

  updateContestData() {
    this.allData.forEach(data => {
      if (!this.upcomingContestObject[data.site])
        this.upcomingContestObject[data.site] = new Array();
      this.upcomingContestObject[data.site].push(data);
    });
    this.upcomingContestKeys = Object.keys(this.upcomingContestObject);

    setTimeout(() => {
      this.hideSpinner = true;
      document.getElementById('info').style.display = 'block';
      let elem = document.getElementById('0');
      elem.click();
    }, 1000);
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

  dateToHumanReadable(date: Date) {
    let year = date.getFullYear();

    let month: any = date.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;

    let day: any = date.getDate();
    day = day < 10 ? `0${day}` : day;

    let hour: any = date.getHours();
    hour = hour < 10 ? `0${hour}` : hour;

    let minute: any = date.getMinutes();
    minute = minute < 10 ? `0${minute}` : minute;

    return `${day}/${month}/${year} at ${hour}:${minute}`;
  }

  normalizeDate(date: string) {
    return date
      .split('-').join('')
      .split(':').join('')
      .split('.').join('');
  }

  contestToHumanReadable(data) {
    let res = `
    <a href="${data.url}" title="Contest announcement page" target="_blank" class="link">
      ${data.name}
    </a>`;

    let add_to_calendar: string;
    if (data["status"] == "BEFORE") {
      add_to_calendar = 'https://calendar.google.com/event?action=TEMPLATE';

      let stime = this.normalizeDate(data.start_time);
      let etime = this.normalizeDate(data.end_time);

      add_to_calendar += `&dates=${stime}/${etime}`;  
      add_to_calendar += `&text=${data["name"].split(' ').join('%20')}`;
      add_to_calendar += `&location=${data['url']}`;

      res = `
      <a href="${add_to_calendar}" data-toggle="tooltip" title="Add to calendar" target="_blank">
        <i class="fa fa-calendar-plus-o" aria-hidden="true"></i>
      </a>
      ${res}`;
    } else {
      res = `
      <i class="fa fa-circle" style="color: green" title="Running contest" aria-hidden="true"></i>
      ${res}`;
    }
    return res;
  }

  classNames = ['btn-secondary', 'text-white'];
  removeActiveFromPill() {

    this.classNames.forEach(c => {
      for (let i = 0; i < this.pillElem.children.length; i++) {
        let par = this.pillElem.children[i];
        let elem = par.children[0];
        let className = elem.className;
        let ind = className.indexOf(c);

        if (ind >= 0) {
          let newClassName = className.substring(0, ind) + className.substring(ind + c.length);
          elem.className = newClassName;
        }
      }
    });
  }

  onPillClick(e: any) {
    this.removeActiveFromPill();
    let elem = e.toElement;
    this.classNames.forEach(c => elem.className += ` ${c}`);

    const site = elem.innerText;
    let no = 1;
    let content = "";
    for (let data of this.upcomingContestObject[site]) {
      const contest = this.contestToHumanReadable(data);
      const stime = this.dateToHumanReadable(new Date(data.start_time));
      const etime = this.dateToHumanReadable(new Date(data.end_time));
      const duration = this.secondToHumanReadable(data.duration);

      content += this.makeColumn(no, [contest, stime, etime, duration]);
      no++;
    }

    const thead: string = this.makeHead(['#', 'Contest', 'Start Time', 'End Time', 'Duration']);
    const tbody: string = this.makeBody(content);
    const table = this.makeTable(thead, tbody);
    this.siteDataElem.innerHTML = table;
  }

  /**
   * @param thead Header of the table(use makeHead)
   * @param tbody Body of the table(use makeBody)
   */
  makeTable(thead: string, tbody: string) {
    return `
    <table class="table table-striped border mt-3">
      ${thead}
      ${tbody}
    </table>`;
  }

  // Todo: add calendar
  // <i class="far fa-calendar-plus"></i>

  /**
   * @param head Arrays of Columns
   */
  makeHead(head): string {
    let content: string = "";
    head.forEach(title => content += `<th class="font-weight-bold" scope="col">${title}</th>\n`);

    return `
    <thead>
      <tr>
        ${content}
      </tr>
    </thead>`;
  }

  /**
   * @param content Content inside body(use makeColumn)
   */
  makeBody(content: string): string {
    return `
    <tbody>
      ${content}
    </tbody>`;
  }

  /**
   * Array from contest, exp: no = 1, data = ["xyz", "abc", ...]
   * @param no Serial number
   * @param contest Name of the contest
   * @param stime Starting time of contest
   * @param etime Finish time of contest
   * @param duration Time duration for contest
   */
  makeColumn(no: number, data) {
    let content: string = `<th scope="row">${no}</th>\n`;
    data.forEach(d => content += `<td>${d}</td>\n`);

    return `
    <tr>
      ${content}
    </tr>`;
  }
}