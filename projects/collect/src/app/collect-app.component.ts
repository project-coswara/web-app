import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MatDialog } from "@angular/material/dialog";

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { firebaseConfig } from "../../../../src/environments/environment";
import { UserDataService } from "../../../../src/app/user-data.service";
import {TranslateService} from "@ngx-translate/core";
import {LanguageDialogComponent} from "./language-dialog";

@Component({
  selector: 'cs-collect-root',
  templateUrl: 'collect-app.component.html',
  styles: []
})

export class CollectAppComponent implements OnInit {
  appLoader = true;
  locale = 'en-US'

  constructor(public infoDialog: MatDialog, private router: Router, private userDataService: UserDataService, private activatedRoute: ActivatedRoute, translateService: TranslateService) {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.locale = queryParams.locale || this.locale;
      translateService.use(this.locale);
      this.infoDialog.closeAll();
      if (!queryParams.locale || window.innerWidth < 1024) {
        this.infoDialog.open(LanguageDialogComponent).afterClosed().subscribe((locale) => {
          if (locale) {
            this.router.navigate([], {
              queryParams: {
                locale: locale
              },
              queryParamsHandling: 'merge'
            }).then();
          }
        })
      } else {
        this.infoDialog.closeAll();
      }
    })
  }

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
          appRoot.appLoader = false;
        }).catch((error) => {
          console.error(error)
        })
      } else {
        appRoot.userDataService.clearUserData();
        appRoot.userDataService.clearAppData();
        firebase.auth().signInAnonymously().then(() => {
          appRoot.router.navigate(['']).then();
        });
      }
    });
  }
}
