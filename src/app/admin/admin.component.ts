import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';

import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';

import { UserDataService } from "../user-data.service";
import { health_option_list } from "../../environments/environment";

@Component({
  selector: 'cs-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {
  adminLoader: boolean = true;
  isAdmin: boolean = false;
  userData = null;
  statsData = null;
  dailyStatus = []
  netStatus = []
  dateString = new Date().toISOString().substring(0, 10);
  dateStringList = Array.from(Array(7).keys()).map((index) => {
    return this.getDateStringWithOffset(this.dateString, -1 * index)
  })
  statsUrl = null;
  totalStatsData = null;

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

  constructor(private route: ActivatedRoute, private router: Router, private userDataService: UserDataService, private http:HttpClient) {
    let adminRoot = this;
    this.userDataService.getUserData().subscribe((userData) => {
      if (userData) {
        if (userData.uid) {
          this.userData = userData;
          this.isAdmin = true;
          this.populateData(this.dateString, () => {
            this.adminLoader = false;
          });
        }
        // firebase.database().ref().child('ADMIN').child('ADMIN_TEST').once('value').then((snapshot) => {
        //   adminRoot.isAdmin = true;
        //   const dateString = new Date().toISOString().substring(0, 10)
        //   this.populateData(dateString, () => {
        //     this.adminLoader = false;
        //   })
        // }).catch((error) => {
        //   adminRoot.isAdmin = false;
        //   this.adminLoader = false;
        //   console.error(error)
        // })
      } else {
        this.route.url.subscribe((url) => {
          if (url) {
            // console.log(url)
            this.router.navigate(['login'], { queryParams: { redirect: url } }).then()
          }
        })
      }
    })
  }

  ngOnInit() {
  }

  getDateStringWithOffset(dateString: string, offset: number) {
    const dateStringISO = `${dateString}T00:00:00.000Z`
    const dataObject = new Date(dateStringISO)
    dataObject.setDate(dataObject.getDate() + offset)
    return dataObject.toISOString().substring(0, 10)
  }

  populateData(dateString: string, callback) {
    this.resetStats();
    const db = firebase.firestore();
    Promise.all([
      db.collection('USER_METADATA').doc(dateString).get(),
      db.collection('USER_METADATA').doc(this.getDateStringWithOffset(dateString, -1)).get(),
      db.collection('COLLECT_STATS').doc(this.getDateStringWithOffset(dateString, -2)).get()
    ]).then((result) => {
      if (result[0].exists) {
        const dailyData = result[0].data();
        this.statsData.daily_completed = this.statsData.total_completed = dailyData.completed;
        this.statsData.daily_positive = this.statsData.total_positive = dailyData.positive_mild + dailyData.positive_moderate;
        this.statsData.total_visits += dailyData.visited
      }
      if (result[1].exists) {
        const prevNetData = result[1].data();
        this.statsData.total_completed += prevNetData.completed;
        this.statsData.total_positive += prevNetData.positive_mild + prevNetData.positive_moderate;
        this.statsData.total_visits += prevNetData.visited
      }
      if (result[2].exists) {
        const prevNetData = result[2].data();
        this.statsData.total_completed += prevNetData.completed;
        this.statsData.total_positive += prevNetData.positive_mild + prevNetData.positive_moderate;
        this.statsData.total_visits += prevNetData.visited
      }
      callback(true);
    })
  }

  dateStringChange(dateString) {
    this.adminLoader = true;
    this.populateData(dateString, () => {
      this.adminLoader = false;
    })
  }

  resetStats() {
    this.statsData = {
      'total_visits': 0,
      'total_positive': 0,
      'total_completed': 0,
      'daily_positive': 0,
      'daily_completed': 0
    }
    this.netStatus = [];
    this.dailyStatus = [];
  }
  getTotalStats(){
    this.statsUrl="https://raw.githubusercontent.com/iiscleap/Coswara-Exp/master/status_stats.json"
    this.http.get(this.statsUrl).subscribe((res => {
      this.totalStatsData = res
      // this.totalStatsData = Array.of(this.totalStatsData)

    }))
  }
}
