import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ExtendedModule, FlexModule } from "@angular/flex-layout";
import { MatTabsModule } from "@angular/material/tabs";

import { AppModule } from "../../../../src/app/app.module";
import { CollectAppRoutingModule } from './collect-app-routing.module';
import { CollectAppComponent } from './collect-app.component';
import { DetailsComponent } from './details/details.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { RecordComponent } from './record/record.component';
import { MatStepperModule } from "@angular/material/stepper";
import { ThanksComponent } from './thanks/thanks.component';
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [
    CollectAppComponent,
    DetailsComponent,
    RecordComponent,
    ThanksComponent
  ],
    imports: [
        BrowserModule,
        CollectAppRoutingModule,
        AppModule,
        FlexModule,
        MatTabsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatOptionModule,
        MatSelectModule,
        ExtendedModule,
        MatCheckboxModule,
        MatRadioModule,
        FormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatStepperModule,
        MatIconModule
    ],
  providers: [],
  bootstrap: [CollectAppComponent]
})
export class CollectAppModule { }
