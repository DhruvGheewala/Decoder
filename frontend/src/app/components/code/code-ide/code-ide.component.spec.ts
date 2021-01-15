import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CodeIdeComponent } from './code-ide.component';

describe('CodeIdeComponent', () => {
  let component: CodeIdeComponent;
  let fixture: ComponentFixture<CodeIdeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeIdeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeIdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
