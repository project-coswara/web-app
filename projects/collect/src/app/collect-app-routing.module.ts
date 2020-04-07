import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsComponent } from "./details/details.component";
import { LoginComponent } from "../../../../src/app/login/login.component";
import { RecordComponent } from "./record/record.component";
import { ThanksComponent } from "./thanks/thanks.component";

const routes: Routes = [
  { path: '', component: DetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'record/:stage', component: RecordComponent },
  { path: 'thank-you', component: ThanksComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class CollectAppRoutingModule { }
