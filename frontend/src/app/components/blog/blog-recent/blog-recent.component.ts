import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { IBlog } from '../../../models/blog';
import { BlogService } from '../../../service/blog.service';
import { UserService } from 'src/app/service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-blog-recent',
  templateUrl: './blog-recent.component.html',
  styleUrls: ['./blog-recent.component.css']
})
export class BlogRecentComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    public userService: UserService,
    private spinner: NgxSpinnerService,
  ) { }

  blogs: IBlog[];
  copyBlogs: IBlog[];
  loadingMsg = '';

  ngOnInit(): void {
    this.loadingMsg = "Please wait, Don't think of purple hippos...";
    this.spinner.show();

    this.blogs = [];
    this.copyBlogs = [];

    let user = this.route.snapshot.queryParamMap.get('user');
    if (user) {
      this.blogService.getBlogsByUser(user).subscribe((data) => {
        this.blogs = data;
        if (environment.production) {
          this.spinner.hide();
        } else {
          setTimeout(() => this.spinner.hide(), 2000);
        }
      });
    }
    else {
      this.blogService.getBlogs().subscribe((data) => {
        this.blogs = data;
        if (environment.production) {
          this.spinner.hide();
        } else {
          setTimeout(() => this.spinner.hide(), 2000);
        }
      });
    }

    this.route.queryParams.subscribe((params) => {
      if (params.user && params.search) {
        this.blogService.getBlogsByUser(params.user).subscribe((data) => {
          this.blogs = this.copyBlogs = data;
          this.filter(params.search);
        });
      }
      else if (params.user) {
        this.blogService.getBlogsByUser(params.user).subscribe((data) => {
          this.blogs = this.copyBlogs = data;
        });
      }
      else if (params.search) {
        this.blogService.getBlogs().subscribe((data) => {
          this.blogs = this.copyBlogs = data;
          this.filter(params.search);
        });
      }
      else {
        this.blogService.getBlogs().subscribe((data) => {
          this.blogs = this.copyBlogs = data;
        });
      }
    });
  }

  filter(query: string) {
    query = query.toLowerCase().trim();
    let terms: string[] = query.split(' ');
    this.blogs = [];

    this.copyBlogs.forEach(b => {
      let ok: boolean = false;
      terms.forEach(term => {
        if (b.title.toLocaleLowerCase().includes(term) || b.author.toLocaleLowerCase().includes(term)) {
          ok = true;
        }
        let dateSplit = b.published.split('-');
        dateSplit.forEach(ele => {
          if (ele.includes(term)) {
            ok = true;
          }
        });
      });
      if (ok) {
        this.blogs.push(b);
      }
    });
  }
}
