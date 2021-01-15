import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpcomingContestComponent } from './upcoming-contest.component';

describe('UpcomingContestComponent', () => {
  let component: UpcomingContestComponent;
  let fixture: ComponentFixture<UpcomingContestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpcomingContestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingContestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
