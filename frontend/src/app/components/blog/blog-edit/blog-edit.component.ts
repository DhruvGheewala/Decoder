import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IBlog } from '../../../models/blog';
import { BlogService } from '../../../service/blog.service';

@Component({
  selector: 'app-blog-edit',
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.css']
})
export class BlogEditComponent implements OnInit {

  blog_id: string;
  blogForm: FormGroup;
  previewMode: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService
  ) {
    this.blog_id = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.previewMode = false;
    this.blogService.getBlogById(this.blog_id).subscribe((data) => {
      if (data) {
        if (data._id === '-1') {
          this.errorPage();
        }
        else {
          this.blogForm = this.formBuilder.group({
            _id: [data._id],
            author: new FormControl({ value: data.author, disabled: true }, Validators.required),
            published: new FormControl({ value: data.published, disabled: true }, Validators.required),
            title: [data.title, Validators.required],
            description: [data.description, Validators.required],
            content: [data.content, Validators.required],
          });
        }
      }
      else {
        this.errorPage();
      }
    });
  }

  updateBlog() {
    console.log("update");
    if (!this.blogForm.invalid) {
      // let contentEle = this.blogForm.controls.content.value.replace(/^\s+|\s+$/g, '');
      const blog_data = {
        _id: this.blogForm.controls._id.value,
        author: this.blogForm.controls.author.value,
        title: this.blogForm.controls.title.value,
        description: this.blogForm.controls.description.value,
        content: this.blogForm.controls.content.value
      }

      this.blogService.updateBlog(blog_data).subscribe((data) => {
        this.router.navigate(['/blog/view/' + blog_data._id]);
      });
    }
    else {
      console.log("invalid form data");
    }
  }

  errorPage() {
    this.router.navigate(['/error']);
  }

  previewOn() {
    console.log("on");
    this.previewMode = true;
  }
  previewOff() {
    console.log("off");
    this.previewMode = false;
  }

  hasError(input: string): boolean {
    return this.blogForm.get(input).hasError('required') && this.blogForm.get(input).touched;
  }
}
