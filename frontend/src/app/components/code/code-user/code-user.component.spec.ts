import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CodeUserComponent } from './code-user.component';

describe('CodeUserComponent', () => {
  let component: CodeUserComponent;
  let fixture: ComponentFixture<CodeUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
