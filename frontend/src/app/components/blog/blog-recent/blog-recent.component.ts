import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { IBlog } from '../../../models/blog';
import { BlogService } from '../../../service/blog.service';
import { UserService } from 'src/app/service/user.service';

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
    public userService: UserService
  ) { }

  blogs: IBlog[];
  copyBlogs: IBlog[];

  ngOnInit(): void {
    this.blogs = [];
    this.copyBlogs = [];

    let user = this.route.snapshot.queryParamMap.get('user');
    if (user) {
      console.log(user);
      this.blogService.getBlogsByUser(user).subscribe((data) => {
        this.blogs = data;
        console.log(data);
      });
    }
    else {
      this.blogService.getBlogs().subscribe((data) => {
        this.blogs = data;
        console.log(data);
      });
    }

    this.route.queryParams.subscribe((params) => {
      if (params.user && params.search) {
        console.log("both", params.user, params.search);
        this.blogService.getBlogsByUser(params.user).subscribe((data) => {
          this.blogs = this.copyBlogs = data;
          console.log(this.blogs);
          this.filter(params.search);
        });
      }
      else if (params.user) {
        console.log("user", params.user);
        this.blogService.getBlogsByUser(params.user).subscribe((data) => {
          this.blogs = this.copyBlogs = data;
          console.log(this.blogs);
        });
      }
      else if (params.search) {
        console.log("search", params.search);
        this.blogService.getBlogs().subscribe((data) => {
          this.blogs = this.copyBlogs = data;
          console.log(this.blogs);
          this.filter(params.search);
        });
      }
      else {
        this.blogService.getBlogs().subscribe((data) => {
          this.blogs = this.copyBlogs = data;
          console.log(this.blogs);
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
