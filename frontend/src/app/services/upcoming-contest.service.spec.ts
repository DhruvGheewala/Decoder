import { TestBed } from '@angular/core/testing';

import { UpcomingContestService } from './upcoming-contest.service';

describe('UpcomingContestService', () => {
  let service: UpcomingContestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpcomingContestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
