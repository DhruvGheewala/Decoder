import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogRecentComponent } from './blog-recent.component';

describe('BlogRecentComponent', () => {
  let component: BlogRecentComponent;
  let fixture: ComponentFixture<BlogRecentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogRecentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogRecentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
