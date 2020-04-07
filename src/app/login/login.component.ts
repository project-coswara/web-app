import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import * as firebase from "firebase/app";
import 'firebase/auth';

import {UserDataService} from "../user-data.service";

@Component({
  selector: 'cs-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})

export class LoginComponent implements OnInit {
  loginLoader = false;

  constructor(private router: Router, private userDataService: UserDataService) {}

  ngOnInit() {
    let loginRoot = this;
    this.userDataService.getUserData().subscribe(userData => {
      if (userData && !loginRoot.loginLoader) {
        loginRoot.router.navigateByUrl('/').then(r => {
          console.debug('Redirecting to collect home page!');
        });
      }
    });
  }

  guestLogin() {
    let loginRoot = this;
    this.loginLoader = true;
    firebase.auth().signInAnonymously().then(function (userCredential) {
      console.debug('Registration for anonymous user started!');
      loginRoot.router.navigate(['']).then();
    });
  };
}
