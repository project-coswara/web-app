import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContentComponent } from "./content/content.component";
import { LoginComponent } from "./login/login.component";
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { UserDataService } from "./user-data.service";
import { HomeComponent } from './home/home.component';
import { TermsComponent } from './terms/terms.component';
import { AboutComponent } from './about/about.component';
import { TeamComponent } from './team/team.component';
import { ContactComponent } from './contact/contact.component';
import { PermissionsComponent } from './permissions/permissions.component';

@NgModule({
  declarations: [
    AppComponent,
    ContentComponent,
    LoginComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    TermsComponent,
    AboutComponent,
    TeamComponent,
    ContactComponent,
    PermissionsComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatProgressSpinnerModule
  ],
  providers: [
      UserDataService
  ],
  exports: [
    ContentComponent,
    NavbarComponent,
    FooterComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
