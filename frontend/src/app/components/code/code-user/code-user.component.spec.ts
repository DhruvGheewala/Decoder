import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeUserComponent } from './code-user.component';

describe('CodeUserComponent', () => {
  let component: CodeUserComponent;
  let fixture: ComponentFixture<CodeUserComponent>;

  beforeEach(async(() => {
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
