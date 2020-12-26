import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

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
  selectedPill = '';
  upcomingContestObject = {};
  hideSpinner: boolean = false;
  upcomingContestKeys = new Array();
  tableHeads = ['#', 'Contest', 'Start Time', 'End Time', 'Duration'];

  constructor(private http: HttpClient, private router: Router) { }
  ngOnInit(): void {
    try {
      this.http.get<any>(this.urls[1]).subscribe((data) => {
        this.allData = data;
        this.contestDataFetched();
      });
    } catch (error) {
      this.router.navigate(['/error']);
    }
  }
  ngAfterViewInit(): void {
    this.pillElem = this.pillElemRef.nativeElement;
    this.siteDataElem = this.siteDataElemRef.nativeElement;
  }

  /**
   * This method will be called when data is fetched from API.
   * This method will generate upcomingContestKeys & upcomingContestObject
   */
  contestDataFetched() {
    this.allData.forEach(data => {
      if (!this.upcomingContestObject[data.site])
        this.upcomingContestObject[data.site] = new Array();
      this.upcomingContestObject[data.site].push(this.generateColumn(data));
    });

    this.upcomingContestKeys = Object.keys(this.upcomingContestObject);
    this.selectedPill = this.upcomingContestKeys[0];

    setTimeout(() => {
      this.hideSpinner = true;
      document.getElementById('info').style.display = 'block';
      let elem = document.getElementById('0');
      elem.click();
    }, 500);
  }

  /**
   * This method will return object according to create table
   * @param _data
   * data: contains data to be printed in a row(contest details)
   * 
   * url: url for that contest
   * 
   * isRunning: true if contest is running else false
   * 
   * calendarLink: Google Calendar Link to add this event for reminder
   */
  generateColumn(_data: any) {
    return {
      data: [
        _data.name,
        this.dateToHumanReadable(new Date(_data.start_time)),
        this.dateToHumanReadable(new Date(_data.end_time)),
        this.secondToHumanReadable(_data.duration)
      ],
      url: _data.url,
      isRunning: (_data.status === "CODING"),
      calendarLink: this.getCalendarLink(_data)
    };
  }

  /**
   * Returns a human readable format of date
   * @param date Date
   */
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
    const stime = this.normalizeDate(data.start_time);
    const etime = this.normalizeDate(data.end_time);

    let res: string = 'https://calendar.google.com/event?action=TEMPLATE';
    res += `&dates=${stime}/${etime}`;
    res += `&text=${data.name.split(' ').join('%20')}`;
    res += `&location=${data.url}`;
    return res;
  }

  /**
   * Normalize the given date for google calendar link
   * @param date 
   */
  normalizeDate(date: string) {
    return date
      .split('-').join('')
      .split(':').join('')
      .split('.').join('');
  }

  private classNames = ['btn-secondary', 'text-white'];
  onPillClick(e: any) {
    this.removeActiveFromPill();
    let elem = e.toElement;
    this.classNames.forEach(c => elem.className += ` ${c}`);
    this.selectedPill = elem.innerText;
  }

  /**
   * Removes active & similar class of bootstrap from previously selected pill
   */
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
}