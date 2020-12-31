import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeRecentComponent } from './code-recent.component';

describe('CodeRecentComponent', () => {
  let component: CodeRecentComponent;
  let fixture: ComponentFixture<CodeRecentComponent>;

  beforeEach(async(() => {
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
