import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

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

  constructor(private route: ActivatedRoute, private router: Router, private userDataService: UserDataService) {}

  ngOnInit() {
    this.userDataService.getUserData().subscribe(userData => {
      if (userData && !this.loginLoader) {
        this.redirectAfterSuccess();
      }
    })
  }

  googleLogin() {
    let loginRoot = this;
    this.loginLoader = true;
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider).then(function(result) {
      loginRoot.redirectAfterSuccess();
      loginRoot.loginLoader = false;
    }).catch(function(error) {
      console.error(error)
      loginRoot.loginLoader = false;
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

  redirectAfterSuccess() {
    this.route.queryParams.subscribe((queryParams) => {
      this.router.navigateByUrl(queryParams.redirect || '').then()
    })
  }
}
