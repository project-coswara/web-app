import { Component, OnInit } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/auth'

@Component({
  selector: 'cs-thanks-thanks',
  templateUrl: './thanks.component.html',
  styleUrls: ['./thanks.component.less']
})

export class ThanksComponent implements OnInit {

  constructor() { }
  ngOnInit() {
  }

  startSession() {
    firebase.auth().signOut().then();
  }
}
