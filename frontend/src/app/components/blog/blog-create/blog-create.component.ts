import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogService } from '../../../service/blog.service';
import { UserService } from 'src/app/service/user.service';

declare var $;
@Component({
  selector: 'app-blog-create',
  templateUrl: './blog-create.component.html',
  styleUrls: ['./blog-create.component.css']
})
export class BlogCreateComponent implements OnInit {

  default_content: string = `
### Hello user.
you have to use markdown style for blog content.
***
#### List example
1. First item
2. Second item
3. Third item
    1. Indented item
    2. Indented item
4. Fourth item
***
#### blod, italic, link example
*this is italic text*  
**this is bold**  
My favorite search engine is [Duck Duck Go](https://duckduckgo.com).
***
#### code example
\`\`\`cpp
#include <bits/stdc++.h>
using namespace std;
int main()
{
    cout << "Hello World!!";
    return 0;
}
\`\`\`
\`single line highlight\`
***
`;

  previewMode: boolean = false;

  public blogForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private blogService: BlogService,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.previewMode = true;
    this.blogForm = this.formBuilder.group({
      author: [this.userService.currentUser, Validators.required],
      title: ['', Validators.required],
      content: [this.default_content, Validators.required],
      description: ['', Validators.required],
    });
  }

  dateFormat() {
    let months = [
      "Jan", "Feb", "Mar", "Apr",
      "May", "Jun", "Jul", "Aug",
      "Sep", "Oct", "Nov", "Dec"
    ];
    let d = new Date();
    let day = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  createBlog() {
    // console.log(this.blogForm);
    if (!this.blogForm.invalid) {
      const blog_data = {
        author: this.blogForm.controls.author.value,
        published: this.dateFormat(),
        title: this.blogForm.controls.title.value,
        description: this.blogForm.controls.description.value,
        content: this.blogForm.controls.content.value,
      }

      this.blogService.createBlog(blog_data).subscribe((data) => {
        this.router.navigate(['/questions/view/' + data._id]);
      });
    }
  }

  previewOn() {
    this.previewMode = true;
  }
  previewOff() {
    this.previewMode = false;
  }

  hasError(input: string): boolean {
    return this.blogForm.get(input).hasError('required') && this.blogForm.get(input).touched;
  }

  keyDownContent(e) {
    if (e.key == 'Tab') {
      e.preventDefault();
      var curPos = $('#contentTextArea')[0].selectionStart;
      let x = $('#contentTextArea').val();
      let text_to_insert = '\t';
      $('#contentTextArea').val(x.slice(0, curPos) + text_to_insert + x.slice(curPos));
      $('#contentTextArea')[0].selectionStart = curPos + text_to_insert.length;
      $('#contentTextArea')[0].selectionEnd = curPos + text_to_insert.length;
    }
  }
}
