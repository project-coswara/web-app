import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import { firebaseConfig } from "../../../../src/environments/environment";

@Component({
  selector: 'cs-collect-root',
  templateUrl: 'collect-app.component.html',
  styles: []
})

export class CollectAppComponent implements OnInit {
  is_loaded = false;

  constructor(private router: Router) { }

  ngOnInit() {
    let app_root = this;
    // app_root.is_loaded = true;
    firebase.initializeApp(firebaseConfig);

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase.database().ref('USERS').child(user.uid).once('value').then(function (dataSnapshot) {
          if(dataSnapshot.val() == null || !dataSnapshot.val()['ad']) {
            app_root.router.navigateByUrl('/details').then(r => {
              console.debug('Redirecting to details page!');
            });
          }
          app_root.is_loaded = true;
        })
      } else {
        app_root.is_loaded = true;
        app_root.router.navigateByUrl('/login').then(r => {
          console.debug('Redirecting to login page!');
        });
      }
    });
  }
}
