import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import * as firebase from "firebase/app";
import 'firebase/auth';

@Component({
  selector: 'cs-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})

export class LoginComponent implements OnInit {
  login_loader = false;
  private db = firebase.database();
  private user_ref = this.db.ref('USERS');

  constructor(private router: Router) {}

  ngOnInit() {
    let login_root = this;
    firebase.auth().onAuthStateChanged(function (user) {
      if (user && !login_root.login_loader) {
        login_root.router.navigateByUrl('/').then(r => {
          console.debug('Redirecting to collect home page!');
        });
      }
    })
  }

  loginAnonymously = function () {
    let login_root = this;
    login_root.login_loader = true;
    firebase.auth().signInAnonymously().then(function (userCredential) {
      console.debug('Registration for anonymous user started!');
      login_root.router.navigateByUrl('/details').then(r => {
        console.debug('Redirecting to details page!');
      });
    }).catch(function (error) {
      if (error.code === 'auth/admin-restricted-operation') {
        console.error('You must enable Anonymous auth in the Firebase Console.');
      } else {
        console.error(error);
      }
    });
  };
}
