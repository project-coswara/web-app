import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { general_option_list, health_option_list } from "../../../../../src/environments/environment";
import { UserDataService } from "../../../../../src/app/user-data.service";

@Component({
  selector: 'cs-collect-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})

export class DetailsComponent implements OnInit {
  selectedIndex = 0;
  disableMetaData: boolean = true;
  finishedMetaData: boolean = false;
  submitLoader: boolean = false;
  userData = null;
  formControls = {
    age: new FormControl(null,[Validators.required, Validators.min(0), Validators.max(140)]),
    gender: new FormControl(null,[Validators.required]),
    englishProficient: new FormControl('y', [Validators.required]),
    country: new FormControl(null, [Validators.required]),
    state: new FormControl(null, [Validators.required]),
    locality: new FormControl(null),
    currentStatus: new FormControl('healthy', [Validators.required]),
    smoker: new FormControl(false),
    asthma: new FormControl(false),
    cld: new FormControl(false),
    ht: new FormControl(false),
    ihd: new FormControl(false),
    diabetes: new FormControl(false)
  };
  formGroups = {
    metadata: new FormGroup({
      age: this.formControls.age,
      gender: this.formControls.gender,
      englishProficient: this.formControls.englishProficient,
      country: this.formControls.country,
      state: this.formControls.state,
      locality: this.formControls.locality
    }),
    healthStatus: new FormGroup({
      currentStatus: this.formControls.currentStatus,
      smoker: this.formControls.smoker,
      asthma: this.formControls.asthma,
      cld: this.formControls.cld,
      ht: this.formControls.ht,
      ihd: this.formControls.ihd,
      diabetes: this.formControls.diabetes
    })
  };
  optionList = {
    genderList: general_option_list.gender,
    countryList: general_option_list.countries,
    stateList: general_option_list.states,
    selectedStateList: [],
    currentStatusList: health_option_list.current_status,
    healthConditionList: health_option_list.conditions
  };

  constructor(private router: Router, private userDataService: UserDataService) {
    this.userDataService.getUserData().subscribe(userData => {
      this.userData = userData;
    });

    this.userDataService.getMetaData().subscribe(metaData => {
      if (metaData) {
        this.finishedMetaData = metaData['aMD'];
        if (metaData['cS'] == 'done') {
          this.goToThankYouPage()
        }
      }
    });
  }

  ngOnInit() { }

  goToRecordPage() {
    this.router.navigateByUrl('/record').then();
  }

  goToThankYouPage() {
    this.router.navigate(['thank-you']).then();
  }

  submitData() {
    let detailsRoot = this;
    if(this.userData && this.formGroups.metadata.valid && this.formGroups.healthStatus.valid) {
      this.submitLoader = true;
      let userMetaData = {
        'a': this.formControls.age.value,
        'g': this.formControls.gender.value,
        'ep': this.formControls.englishProficient.value,
        'l_c': this.formControls.country.value,
        'l_s': this.formControls.state.value
      };
      if(detailsRoot.formControls.locality.value) {
        userMetaData['l_l'] = detailsRoot.formControls.locality.value;
      }
      let userHealthData = { 'covid_status': this.formControls.currentStatus.value };
      for( let key in this.optionList.healthConditionList) {
        this.optionList.healthConditionList[key].forEach(function (item, index) {
          if(detailsRoot.formControls[item.id].value) {
            userHealthData[item.id] = true;
          }
        })
      }
      let appMetaData = {
        'aMD': true,
        'uT': 'anonymous'
      };
      let db = firebase.firestore();
      let firebaseBatch = db.batch();
      firebaseBatch.set(
          db.collection('METADATA').doc(detailsRoot.userData.uid),
          userMetaData
      );
      firebaseBatch.set(
          db.collection('HEALTH_DATA').doc(detailsRoot.userData.uid),
          userHealthData
      );
      firebaseBatch.set(
          db.collection('USERS').doc(detailsRoot.userData.uid),
          appMetaData
      );
      firebaseBatch.commit().then(function () {
        detailsRoot.userDataService.sendMetaData(appMetaData);
        detailsRoot.goToRecordPage();
      });
    }
  };

  getStates() {
    this.optionList.selectedStateList = this.optionList.stateList[
        this.formControls.country.value
            .toLowerCase()
            .replace(' ', '_')
            .replace('(', '')
            .replace(')','')
        ];
  };
}
