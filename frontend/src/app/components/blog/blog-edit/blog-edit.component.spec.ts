import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BlogEditComponent } from './blog-edit.component';

describe('BlogEditComponent', () => {
  let component: BlogEditComponent;
  let fixture: ComponentFixture<BlogEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
