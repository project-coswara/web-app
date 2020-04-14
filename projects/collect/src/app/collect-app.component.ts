import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { firebaseConfig } from "../../../../src/environments/environment";
import { UserDataService } from "../../../../src/app/user-data.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'cs-collect-root',
  templateUrl: 'collect-app.component.html',
  styles: []
})

export class CollectAppComponent implements OnInit {
  appLoader = true;
  isFacebook = false;

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private router: Router, private userDataService: UserDataService) {
    this.route.queryParams.subscribe((params) => {
      if (params.fbclid) {
        this.isFacebook = true;
      }
    })
  }

  ngOnInit() {
    let appRoot = this;
    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        appRoot.userDataService.sendUserData(user);
        firebase.firestore().collection('USERS').doc(user.uid).get().then((doc) => {
          let startedRecording = false;
          if (doc.exists) {
            appRoot.userDataService.sendMetaData(doc.data())
            if (doc.data()['cS']) {
              startedRecording = true;
            }
          }
          if (!startedRecording && appRoot.isMobileDevice() ) {
            const dialogRef = appRoot.dialog.open(BrowserNoteDialogComponent);
            dialogRef.afterClosed().subscribe(result => {
              appRoot.appLoader = false;
            });
          } else {
            appRoot.appLoader = false;
          }
          // appRoot.router.navigate(['permissions']).then();
        })
      } else {
        appRoot.userDataService.sendUserData(null);
        appRoot.userDataService.sendMetaData(null);
        firebase.auth().signInAnonymously().then(function (userCredential) {
          appRoot.router.navigate(['']).then();
        });
      }
    });
  }

  isMobileDevice = function() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
  };
}

@Component({
  selector: 'browser-note-dialog',
  templateUrl: 'browser-note-dialog.html',
  styleUrls: ['browser-note-dialog.less']
})

export class BrowserNoteDialogComponent {}
