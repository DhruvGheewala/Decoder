import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CodeRecentComponent } from './code-recent.component';

describe('CodeRecentComponent', () => {
  let component: CodeRecentComponent;
  let fixture: ComponentFixture<CodeRecentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeRecentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeRecentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
