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

  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    try {

    } catch (error) {
      document.location.href = '/error';
    }
    this.http.get<any>(this.urls[1]).subscribe((data) => {
      this.allData = data;
      this.updateContestData();
    });
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
  }

  removeActiveFromPill() {
    for (let i = 0; i < this.pillElem.children.length; i++) {
      let par = this.pillElem.children[i];
      let elem = par.children[0];
      let className = elem.className;
      let ind = className.indexOf('active');

      if (ind >= 0) {
        let newClassName = className.substring(0, ind) + className.substring(ind + 'active'.length);
        elem.className = newClassName;
      }
    }
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
    } else if(days < 365) {
      return `${days} Day`;
    } else {
      return `${years} Yrs`;
    }
  }

  onPillClick(e: any) {
    this.removeActiveFromPill();
    let elem = e.toElement;
    elem.className += " active";

    const site = elem.innerText;
    let no = 1;
    let content = "";
    for (let data of this.upcomingContestObject[site]) {
      const stime = new Date(data.start_time);
      const etime = new Date(data.end_time);
      const duration = this.secondToHumanReadable(data.duration);
      console.log(duration);

      content += this.makeColumn(no, [data.name, stime, etime, duration]);
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
    <table class="table">
      ${thead}
      ${tbody}
    </table>`;
  }

  /**
   * @param head Arrays of Columns
   */
  makeHead(head): string {
    let content: string = "";
    head.forEach(title => content += `<th scope="col">${title}</th>\n`);

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