import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CollectAppRoutingModule } from './collect-app-routing.module';
import { CollectAppComponent } from './collect-app.component';
import { AppModule } from "../../../../src/app/app.module";

@NgModule({
  declarations: [
    CollectAppComponent
  ],
  imports: [
    BrowserModule,
    CollectAppRoutingModule,
    AppModule
  ],
  providers: [],
  bootstrap: [CollectAppComponent]
})
export class CollectAppModule { }
