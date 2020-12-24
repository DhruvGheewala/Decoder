import { Component, OnInit } from '@angular/core';

import { UpcomingContestService } from "../../services/upcoming-contest.service";

@Component({
  selector: 'app-upcoming-contest',
  templateUrl: './upcoming-contest.component.html',
  styleUrls: ['./upcoming-contest.component.css']
})
export class UpcomingContestComponent implements OnInit {

  constructor(
    private upcomingContestService: UpcomingContestService
  ) { }

  all_data = null;
  ngOnInit(): void {
    this.upcomingContestService.getUpcommingContestData().subscribe((data) => {
      this.all_data = data;
      console.log(data);
    });
  }
}
