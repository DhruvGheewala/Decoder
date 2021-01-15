import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CodeViewComponent } from './code-view.component';

describe('CodeViewComponent', () => {
  let component: CodeViewComponent;
  let fixture: ComponentFixture<CodeViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
