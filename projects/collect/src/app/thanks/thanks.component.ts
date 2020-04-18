import { Component, OnInit } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/firestore'
import {UserDataService} from "../../../../../src/app/user-data.service";
import {FormControl, Validators} from "@angular/forms";
import {matFormFieldAnimations} from "@angular/material/form-field";

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

  feedbackControl = new FormControl(null, [Validators.required]);

  constructor(private userDataService: UserDataService) {
    this.userDataService.getUserData().subscribe(userData => {
      this.userData = userData;
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
