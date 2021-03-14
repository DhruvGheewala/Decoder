// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { AlertModule } from '@full-fledged/alerts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { UpcomingContestComponent } from './components/upcoming-contest/upcoming-contest.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { BlogViewComponent } from './components/blog/blog-view/blog-view.component';
import { BlogCreateComponent } from './components/blog/blog-create/blog-create.component';
import { BlogEditComponent } from './components/blog/blog-edit/blog-edit.component';
import { BlogRecentComponent } from './components/blog/blog-recent/blog-recent.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AboutComponent } from './components/about/about.component';
import { CodeIdeComponent } from './components/code/code-ide/code-ide.component';
import { CodeViewComponent } from './components/code/code-view/code-view.component';
import { CodeRecentComponent } from './components/code/code-recent/code-recent.component';

// Service
import { UserService } from "./service/user.service";
import { AdminService } from "./service/admin.service";
import { BlogService } from "./service/blog.service";
import { CodeUserComponent } from './components/code/code-user/code-user.component';
import { AuthInterceptor } from './service/authconfig.interceptor';

import { SecurityContext } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

import 'prismjs';
import 'prismjs/components/prism-c.min.js';
import 'prismjs/components/prism-cpp.min.js';
import 'prismjs/components/prism-csharp.min.js';
import 'prismjs/components/prism-css.min.js';
import 'prismjs/components/prism-java.min.js';
import 'prismjs/components/prism-typescript.min.js';
import 'prismjs/components/prism-javascript.min.js';
import 'prismjs/components/prism-json.min.js';
import 'prismjs/components/prism-latex.min.js';
import 'prismjs/components/prism-markdown.min.js';
import 'prismjs/components/prism-mongodb.min.js';
import 'prismjs/components/prism-python.min.js';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ErrorComponent,
    UpcomingContestComponent,
    ContactComponent,
    LoginComponent,
    BlogViewComponent,
    BlogCreateComponent,
    BlogEditComponent,
    BlogRecentComponent,
    RegisterComponent,
    ProfileComponent,
    AboutComponent,
    CodeViewComponent,
    CodeRecentComponent,
    CodeIdeComponent,
    CodeUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    AlertModule.forRoot({ maxMessages: 5, timeout: 2000, positionX: 'left' }),
    MarkdownModule.forRoot({
      loader: HttpClient,
      sanitize: SecurityContext.NONE
    }),
    BrowserAnimationsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    AdminService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
