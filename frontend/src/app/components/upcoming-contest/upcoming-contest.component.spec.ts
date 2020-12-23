import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingContestComponent } from './upcoming-contest.component';

describe('UpcomingContestComponent', () => {
  let component: UpcomingContestComponent;
  let fixture: ComponentFixture<UpcomingContestComponent>;

  beforeEach(async(() => {
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
