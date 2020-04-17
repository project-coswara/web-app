import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";

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
  appLoader = true;

  constructor(public infoDialog: MatDialog, private router: Router, private userDataService: UserDataService) { }

  ngOnInit() {
    let appRoot = this;
    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        appRoot.userDataService.sendUserData(user);
        firebase.firestore().collection('USER_APPDATA').doc(user.uid).get().then((doc) => {
          let startedRecord = false;
          if (doc.exists) {
            appRoot.userDataService.sendAppData(doc.data())
            if (doc.data()['cS']) { startedRecord = true; }
          }
          if (!startedRecord && window.innerWidth < 1024) {
            appRoot.infoDialog.open(BrowserNoteDialogComponent)
                .afterClosed()
                .subscribe(result => { appRoot.appLoader = false; });
          } else {
            appRoot.appLoader = false;
          }
        }).catch((error) => {
          console.error(error)
        })
      } else {
        appRoot.userDataService.clearUserData();
        appRoot.userDataService.clearAppData();
        firebase.auth().signInAnonymously().then(function (userCredential) {
          appRoot.router.navigate(['']).then();
        });
      }
    });
  }
}

@Component({
  selector: 'browser-note-dialog',
  templateUrl: 'browser-note-dialog.html',
  styleUrls: ['browser-note-dialog.less']
})

export class BrowserNoteDialogComponent {}
