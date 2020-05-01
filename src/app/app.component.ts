import { Component, OnInit } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/auth';

import { firebaseConfig } from "../environments/environment";
import {UserDataService} from "./user-data.service";

@Component({
  selector: 'cs-root',
  templateUrl: 'app.component.html',
  styles: []
})

export class AppComponent implements OnInit {
  appLoader = true;

  tabsList = [{
    'id': 'home',
    'name': 'Home',
    'url': ''
  }, {
    'id': 'about',
    'name': 'About',
    'url': 'about'
  }, {
    'id': 'team',
    'name': 'People',
    'url': 'team'
  }, {
    'id': 'faq',
    'name': 'FAQ',
    'url': 'faq'
  }, ]

  constructor(private userDataService: UserDataService) { }

  ngOnInit() {
    let appRoot = this;
    this.appLoader = false;
    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged(function (user) {
      appRoot.userDataService.sendUserData(user);
      if (user) {

      } else {

      }
    });
  }
}
