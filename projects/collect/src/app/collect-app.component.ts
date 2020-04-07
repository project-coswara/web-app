import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { firebaseConfig } from "../../../../src/environments/environment";
import { UserDataService } from "../../../../src/app/user-data.service";

@Component({
  selector: 'cs-collect-root',
  templateUrl: 'collect-app.component.html',
  styles: []
})

export class CollectAppComponent implements OnInit {
  appLoader = false;

  constructor(private router: Router, private userDataService: UserDataService) { }

  ngOnInit() {
    let appRoot = this;
    // appRoot.appLoader = true;
    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        appRoot.userDataService.sendUserData(user);
        firebase.firestore().collection('USERS').doc(user.uid).get().then((doc) => {
          if (doc.exists) {
            appRoot.userDataService.sendMetaData(doc.data())
          }
          appRoot.appLoader = true;
        })
      } else {
        appRoot.userDataService.sendUserData(null);
        appRoot.userDataService.sendMetaData(null);
        appRoot.router.navigate(['login']).then();
        appRoot.appLoader = true;
      }
    });
  }
}
