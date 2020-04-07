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

@NgModule({
  declarations: [
    AppComponent,
    ContentComponent,
    LoginComponent,
    NavbarComponent,
    FooterComponent
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
