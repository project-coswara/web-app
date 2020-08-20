import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

import * as firebase from 'firebase/app';
import 'firebase/firestore';

import {environment, general_option_list, health_option_list} from "../../../../../src/environments/environment";
import {UserDataService} from "../../../../../src/app/user-data.service";

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
    age: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(140)]),
    gender: new FormControl(null, [Validators.required]),
    usingMask: new FormControl('n', [Validators.required]),
    englishProficient: new FormControl('y', [Validators.required]),
    returningUser: new FormControl('n'),
    country: new FormControl(null, [Validators.required]),
    state: new FormControl(null, [Validators.required]),
    locality: new FormControl(null),
    currentStatus: new FormControl(null, [Validators.required]),
    conditionStatus: new FormControl(null, [Validators.required]),
    cold: new FormControl(false),
    cough: new FormControl(false),
    fever: new FormControl(false),
    pneumonia: new FormControl(false),
    loss_of_smell: new FormControl(false),
    smoker: new FormControl(false),
    asthma: new FormControl(false),
    cld: new FormControl(false),
    ht: new FormControl(false),
    ihd: new FormControl(false),
    diabetes: new FormControl(false),
    bd: new FormControl(false),
    st: new FormControl(false),
    mp: new FormControl(false),
    ftg: new FormControl(false),
    none: new FormControl(false)
  };
  formGroups = {
    metadata: new FormGroup({
      age: this.formControls.age,
      gender: this.formControls.gender,
      englishProficient: this.formControls.englishProficient,
      returningUser: this.formControls.returningUser,
      country: this.formControls.country,
      state: this.formControls.state,
      locality: this.formControls.locality
    }),
    healthStatus: new FormGroup({
      currentStatus: this.formControls.currentStatus,
      conditionStatus: this.formControls.conditionStatus,
      cold: this.formControls.cold,
      cough: this.formControls.cough,
      fever: this.formControls.fever,
      pneumonia: this.formControls.pneumonia,
      loss_of_smell: this.formControls.loss_of_smell,
      smoker: this.formControls.smoker,
      asthma: this.formControls.asthma,
      cld: this.formControls.cld,
      ht: this.formControls.ht,
      ihd: this.formControls.ihd,
      diabetes: this.formControls.diabetes,
      bd: this.formControls.bd,
      st: this.formControls.st,
      mp: this.formControls.mp,
      ftg: this.formControls.ftg,
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

  constructor(private route: ActivatedRoute, private router: Router, private userDataService: UserDataService) {
    this.userDataService.getUserData().subscribe(userData => {
      this.userData = userData;
      this.submitLoader = false;
    });

    this.userDataService.getAppData().subscribe(metaData => {
      if (metaData) {
        this.finishedMetaData = metaData['fMD'];
        if (metaData['cS'] == 'done') {
          this.goToThankYouPage()
        }
      } else {
        this.finishedMetaData = false;
      }
    });

    this.route.queryParams.subscribe(queryParams => {
      this.formControls.locality.setValue(queryParams.l_l || '')
    })
  }

  ngOnInit() {
  }

  goToRecordPage() {
    this.router.navigate(['record'], {queryParamsHandling: 'merge'}).then();
  }

  goToThankYouPage() {
    this.router.navigate(['thank-you'], {queryParamsHandling: 'merge'}).then();
  }

  setValidity() {
    this.formControls.conditionStatus.setValue(null);
    let currentConditionStatus = false;
    const detailsRoot = this;
    this.optionList.healthConditionList.forEach(function (item) {
      currentConditionStatus = currentConditionStatus || detailsRoot.formControls[item].value
    })
    currentConditionStatus = currentConditionStatus || this.formControls.none.value
    if (currentConditionStatus) {
      this.formControls.conditionStatus.setValue(true)
    }
  }

  startOver() {
    this.submitLoader = true;
    firebase.auth().signOut().then();
  }

  submitData() {
    let detailsRoot = this;
    if (this.userData && this.formGroups.metadata.valid && this.formGroups.healthStatus.valid) {
      this.submitLoader = true;
      const updateDate = new Date().toISOString();
      const dateString = updateDate.substring(0, 10)
      let userMetaData = {
        'dT': 'web',
        'fV': environment.version,
        'a': this.formControls.age.value,
        'g': this.formControls.gender.value,
        'um': this.formControls.usingMask.value,
        'ep': this.formControls.englishProficient.value,
        'rU': this.formControls.returningUser.value,
        'l_c': this.formControls.country.value,
        'l_s': this.formControls.state.value,
        'covid_status': this.formControls.currentStatus.value
      };

      if (detailsRoot.formControls.locality.value) {
        userMetaData['l_l'] = detailsRoot.formControls.locality.value;
      }

      if (!this.formControls.none.value) {
        this.optionList.healthConditionList.forEach(function (item) {
          if (detailsRoot.formControls[item].value) {
            userMetaData[item] = true;
          }
        })
      }

      let userAppData = {
        'fMD': true,
        'dS': dateString,
        'fV': environment.version,
      }

      let db = firebase.firestore();
      let firebaseBatch = db.batch();
      firebaseBatch.set(
        db.doc(`USER_METADATA/${dateString}/DATA/${this.userData.uid}`),
        userMetaData
      );
      firebaseBatch.set(
        db.doc(`USER_APPDATA/${this.userData.uid}`),
        userAppData
      );
      firebaseBatch.commit().then(function () {
        detailsRoot.userDataService.sendAppData(userAppData);
        detailsRoot.goToRecordPage();
      });
    }
  };

  getStates() {
    this.optionList.selectedStateList = this.optionList.stateList[
      this.formControls.country.value
        .toLowerCase()
        .replace(/ /g, '_')
        .replace('(', '')
        .replace(')', '')
      ];
  };

  resetStatus() {
    const detailsRoot = this;
    if (this.formControls.none.value) {
      this.optionList.healthConditionList.forEach(function (item) {
        detailsRoot.formControls[item].disable();
        detailsRoot.formControls[item].setValue(false);
      })
      this.formControls.conditionStatus.setValue(true)
    } else {
      this.optionList.healthConditionList.forEach(function (item) {
        detailsRoot.formControls[item].enable();
      })
      this.formControls.conditionStatus.setValue(null)
    }
  }
}
