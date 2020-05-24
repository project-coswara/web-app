import { Component, OnInit } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'cs-lb',
  templateUrl: './lb.component.html',
  styleUrls: ['./lb.component.less']
})

export class LBComponent implements OnInit {
  leaderBoardList = []
  displayedColumns = ['name', 'value']

  constructor() { }

  ngOnInit() {
    firebase.firestore().collection('ANNOTATE_APPDATA')
      .orderBy('completed', 'desc').limit(50).get().then((snapshots) => {
        snapshots.forEach((doc) => {
          const annotateData = doc.data();
          if (annotateData.completed > 0) {
            this.leaderBoardList.push({
              'name': annotateData.n,
              'pURL': annotateData.pURL,
              'value': annotateData.completed,
              'lastActive': annotateData.lA || null
            })
          }
        })
    })
  }
}

