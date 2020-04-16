import { Component, OnInit } from '@angular/core';
import { UserDataService } from "../user-data.service";
import { ActivatedRoute, Router } from "@angular/router";

import * as firebase from 'firebase/app';
import 'firebase/database';
import {error} from "util";

@Component({
  selector: 'cs-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {
  adminLoader: boolean = true;
  isAdmin: boolean = false;
  userData = null;

  statsList = [{
    'id': 'total_visits',
    'name': 'Total Visits'
  }, {
    'id': 'total_positive',
    'name': 'Total Positive'
  }, {
    'id': 'total_completed',
    'name': 'Total Completed'
  }, {
    'id': 'daily_positive',
    'name': 'Daily Positive'
  }, {
    'id': 'daily_completed',
    'name': 'Daily Completed'
  }]

  statsData = {
    'total_visits': 0,
    'total_positive': 0,
    'total_completed': 0,
    'daily_positive': 0,
    'daily_completed': 0
  }

  lastUpdated = {
    'time': new Date().getTime(),
    'name': 'Anand',
    'content': `Last updated by Anand at ${new Date().toLocaleString()}`
  }

  constructor(private route: ActivatedRoute, private router: Router, private userDataService: UserDataService) {
    let adminRoot = this;
    this.userDataService.getUserData().subscribe((userData) => {
      if (userData) {
        this.userData = userData;
        firebase.database().ref().child('ADMIN').child('ADMIN_TEST').once('value').then((snapshot) => {
          adminRoot.isAdmin = true;
          this.adminLoader = false;
        }).catch((error) => {
          adminRoot.isAdmin = false;
          this.adminLoader = false;
          console.error(error)
        })
      } else {
        this.route.url.subscribe((url) => {
          if (url) {
            this.router.navigate(['login'], { queryParams: { redirect: url } }).then()
          }
        })
      }
    })
  }

  ngOnInit() {
  }

}
