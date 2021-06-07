import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { TestAppRoutingModule } from './test-app-routing.module';
import { TestAppComponent } from './test-app.component';
import { AppModule } from "../../../../src/app/app.module";
import {MAT_DATE_LOCALE} from '@angular/material/core';

@NgModule({
  declarations: [
    TestAppComponent
  ],
  imports: [
    AppModule,
    BrowserModule,
    TestAppRoutingModule
  ],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'en-GB'},],
  bootstrap: [TestAppComponent]
})
export class TestAppModule { }
