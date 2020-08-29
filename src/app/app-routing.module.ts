import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from "./about/about.component";
import { AdminComponent } from "./admin/admin.component";
import { ContactComponent } from "./contact/contact.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { NewsComponent } from "./news/news.component";
import { PermissionsComponent } from "./permissions/permissions.component";
import { TeamComponent } from "./team/team.component";
import { TermsComponent } from "./terms/terms.component";
import {AnnotateComponent} from "./annotate/annotate.component";
import {LBComponent} from "./lb/lb.component";
import { AnnotateV2Component } from './annotate-v2/annotate-v2.component';
import {AnnotateV2TestComponent} from './annotate-v2-test/annotate-v2-test.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'annotate', component: AnnotateComponent },
  { path: 'faq', component: ContactComponent },
  { path: 'leaderboard', component: LBComponent },
  { path: 'login', component: LoginComponent },
  { path: 'media', component: NewsComponent },
  { path: 'permissions', component: PermissionsComponent },
  { path: 'team', component: TeamComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'annotate_v2', component: AnnotateV2Component },
  { path: 'annotate_v2_test', component: AnnotateV2TestComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
