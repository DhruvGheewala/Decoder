import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { IBlog } from '../../../models/blog';
import { BlogService } from '../../../service/blog.service';
import { UserService } from 'src/app/service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-blog-view',
  templateUrl: './blog-view.component.html',
  styleUrls: ['./blog-view.component.css']
})
export class BlogViewComponent implements OnInit {
  blog: IBlog;
  blog_id: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    public userService: UserService,
    private spinner: NgxSpinnerService
  ) {
    this.blog_id = this.route.snapshot.params.id;
  }

  loadingMsg = '';

  ngOnInit(): void {
    this.loadingMsg = 'Loading...';
    this.spinner.show();

    console.log(this.blog_id);
    this.blogService.getBlogById(this.blog_id).subscribe((data) => {
      this.blog = data;
      if (this.blog) {
        if (this.blog._id === '-1') {
          this.errorPage();
        }
      }
      else {
        this.errorPage();
      }
      if (environment.production) {
        this.spinner.hide();
      } else {
        setTimeout(() => this.spinner.hide(), 2000);
      }
    });
  }

  deleteBlog() {
    if (confirm("Are you sure to delete ?")) {
      this.blogService.deleteBlog(this.blog_id).subscribe((data) => {
        this.blog = null;
        this.router.navigate(['/blog/recent']);
      });
    }
  }

  errorPage() {
    this.router.navigate(['/error']);
  }

  isSameAuthor() {
    // console.log("Login : ", this.userService.currentUser);
    // console.log("Author : ", this.blog.author);
    return this.userService?.currentUser === this.blog?.author;
  }
}
