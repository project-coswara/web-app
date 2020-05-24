import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ExtendedModule, FlexModule } from "@angular/flex-layout";
import { MatTabsModule } from "@angular/material/tabs";

import { AppModule } from "../../../../src/app/app.module";
import { CollectAppRoutingModule } from './collect-app-routing.module';
import { BrowserNoteDialogComponent, CollectAppComponent } from './collect-app.component';
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
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    BrowserNoteDialogComponent,
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
        MatIconModule,
        MatDialogModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          },
        })
    ],
  entryComponents: [BrowserNoteDialogComponent],
  providers: [],
  bootstrap: [CollectAppComponent]
})
export class CollectAppModule { }
