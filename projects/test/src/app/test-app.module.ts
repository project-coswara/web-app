import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { TestAppRoutingModule } from './test-app-routing.module';
import { TestAppComponent } from './test-app.component';
import { AppModule } from "../../../../src/app/app.module";

@NgModule({
  declarations: [
    TestAppComponent
  ],
  imports: [
    AppModule,
    BrowserModule,
    TestAppRoutingModule
  ],
  providers: [],
  bootstrap: [TestAppComponent]
})
export class TestAppModule { }
