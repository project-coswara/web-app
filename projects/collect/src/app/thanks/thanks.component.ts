import { Component, OnInit } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/firestore'
import {UserDataService} from "../../../../../src/app/user-data.service";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'cs-thanks-thanks',
  templateUrl: './thanks.component.html',
  styleUrls: ['./thanks.component.less']
})

export class ThanksComponent implements OnInit {
  signOutLoader: boolean = false;
  showFeedbackBox: boolean = true;
  showFeedbackLoader: boolean = false;
  userData = null;
  userAppData = null;
  isOkay = true;
  showMainLoader = true;

  recordStages = ['breathing-shallow', 'breathing-deep', 'cough-shallow', 'cough-heavy', 'vowel-a', 'vowel-e', 'vowel-o',
    'counting-normal', 'counting-fast'];

  feedbackControl = new FormControl(null, [Validators.required]);

  constructor(private userDataService: UserDataService) {
    this.userDataService.getUserData().subscribe(userData => {
      this.userData = userData;
      this.userDataService.getAppData().subscribe(userAppData => {
        this.userAppData = userAppData;
        let isOkay = 0
        let promises = []
        if (this.userAppData.dS && !this.userData.uid) {
          this.recordStages.forEach(stageId => {
            promises.push(firebase.storage()
              .ref('COLLECT_DATA')
              .child(this.userAppData.dS)
              .child(this.userData.uid)
              .child(stageId + '.wav')
              .getMetadata())
          })
          Promise.all(promises).then(results => {
            results.forEach(metadata => {
              if (metadata.size > 100) {
                isOkay += 1
              }
            })
            if (isOkay < this.recordStages.length) {
              this.isOkay = false;
            }
            this.showMainLoader = false;
          }).catch(() => {
            this.isOkay = false;
            this.showMainLoader = false;
          })
        } else {
          this.isOkay = false;
          this.showMainLoader = false;
        }
      })
    })
  }

  ngOnInit() { }

  startSession() {
    this.signOutLoader = true;
    firebase.auth().signOut().then();
  }

  sendFeedback() {
    let thanksRoot = this;
    this.showFeedbackLoader = true;
    let userId = null;
    if (this.feedbackControl.valid) {
      if (this.userData) {
        userId = this.userData.uid;
      }
      firebase.firestore().collection('FEEDBACK').add({
        'fb': this.feedbackControl.value,
        'uid': userId
      }).then(()=> {
        thanksRoot.showFeedbackBox = false;
        thanksRoot.showFeedbackLoader = false;
      });
    }
  }
}
