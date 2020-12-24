import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { UpcomingContestComponent } from './components/upcoming-contest/upcoming-contest.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { BlogViewComponent } from './components/blog/blog-view/blog-view.component';
import { BlogCreateComponent } from './components/blog/blog-create/blog-create.component';
import { BlogEditComponent } from './components/blog/blog-edit/blog-edit.component';
import { BlogListComponent } from './components/blog/blog-list/blog-list.component';

import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ErrorComponent,
    UpcomingContestComponent,
    AboutUsComponent,
    ContactComponent,
    LoginComponent,
    LogoutComponent,
    BlogViewComponent,
    BlogCreateComponent,
    BlogEditComponent,
    BlogListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
