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
  leaderBoardV2List = []
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
    firebase.firestore().collection('ANNOTATE_APPDATA')
    .orderBy('completed_v2', 'desc').limit(50).get().then((snapshots) => {
      snapshots.forEach((doc) => {
        const annotateData = doc.data();
        if (annotateData.completed_v2 > 0) {
          this.leaderBoardV2List.push({
            'name': annotateData.n,
            'pURL': annotateData.pURL,
            'value': annotateData.completed_v2,
            'lastActive': annotateData.lA || null
          })
        }
      })
  })
    
  }
}
