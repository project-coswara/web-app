import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import {formatDate} from '@angular/common';

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
  covidTest: boolean;
  userData = null;
  formControls = {
    age: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(140)]),
    gender: new FormControl(null, [Validators.required]),
    usingMask: new FormControl(null, [Validators.required]),
    englishProficient: new FormControl('y', [Validators.required]),
    returningUser: new FormControl('n'),
    country: new FormControl(null, [Validators.required]),
    state: new FormControl(null, [Validators.required]),
    locality: new FormControl(null),
    covidTestStatus: new FormControl(null, [Validators.required]),
    currentStatus: new FormControl(null, [Validators.required]),
    srf_id: new FormControl(null, [this.srfIdValidator]),
    testDate: new FormControl(null, [Validators.required]),
    minTestDate: new FormControl(new Date()),
    maxTestDate: new FormControl(new Date()),
    testType: new FormControl(null, [Validators.required]),
    ctScan: new FormControl('n', [Validators.required]),
    vaccinated: new FormControl(null, [Validators.required]),
    ctScore: new FormControl(null,[Validators.min(0), Validators.max(25)]),
    ctDate: new FormControl(null),
    conditionStatus: new FormControl(null),
    conditionStatus_1: new FormControl(null, [Validators.required]),
    conditionStatus_2: new FormControl(null, [Validators.required]),
    conditionStatus_3: new FormControl(null, [Validators.required]),
    conditionStatus_4: new FormControl(null, [Validators.required]),
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
    diarrhoea: new FormControl(false),
    bd: new FormControl(false),
    st: new FormControl(false),
    mp: new FormControl(false),
    ftg: new FormControl(false),
    others_resp: new FormControl(false),
    others_preexist: new FormControl(false),
    none: new FormControl(false),
    none_1: new FormControl(false),
    none_2: new FormControl(false),
    none_3: new FormControl(false),
    none_4: new FormControl(false),
    prior_status: new FormControl(null, [Validators.required])

  };
  formGroups = {
    metadata: new FormGroup({
      age: this.formControls.age,
      gender: this.formControls.gender,
      usingMask: this.formControls.usingMask,
      englishProficient: this.formControls.englishProficient,
      returningUser: this.formControls.returningUser,
      vaccinated: this.formControls.vaccinated,
      smoker: this.formControls.smoker,
      country: this.formControls.country,
      state: this.formControls.state,
      locality: this.formControls.locality
    }),
    healthStatus: new FormGroup({
      conditionStatus_1: this.formControls.conditionStatus_1,
      conditionStatus_2: this.formControls.conditionStatus_2,
      conditionStatus_3: this.formControls.conditionStatus_3,
      conditionStatus_4: this.formControls.conditionStatus_4,
      cold: this.formControls.cold,
      cough: this.formControls.cough,
      fever: this.formControls.fever,
      pneumonia: this.formControls.pneumonia,
      loss_of_smell: this.formControls.loss_of_smell,
      asthma: this.formControls.asthma,
      cld: this.formControls.cld,
      ht: this.formControls.ht,
      ihd: this.formControls.ihd,
      diabetes: this.formControls.diabetes,
      diarrhoea: this.formControls.diarrhoea,
      bd: this.formControls.bd,
      st: this.formControls.st,
      mp: this.formControls.mp,
      ftg: this.formControls.ftg,
      others_resp: this.formControls.others_resp,
      others_preexist: this.formControls.others_preexist,
    }),
    covidStatus: new FormGroup({
      currentStatus: this.formControls.currentStatus,
      covidTestStatus: this.formControls.covidTestStatus, 
      ctScan: this.formControls.ctScan,
      testType: this.formControls.testType,
      testDate: this.formControls.testDate,
      srf_id: this.formControls.srf_id,
      prior_status: this.formControls.prior_status
     })
  };
  optionList = {
    genderList: general_option_list.gender,
    countryList: general_option_list.countries,
    stateList: general_option_list.states,
    selectedStateList: [],
    currentStatusList: health_option_list.current_status,
    currentHealthConditions1: health_option_list.current_health_conditions_1,
    currentHealthConditions2: health_option_list.current_health_conditions_2,
    respAilments: health_option_list.resp_ailments,
    preexistingConditions: health_option_list.preexisting_conditions,
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

    this.route.queryParams.subscribe(queryParams => {
      this.formControls.srf_id.setValue(queryParams.srf_id || '')
    })
  }

  ngOnInit() {
    let cur_date = new Date();
    cur_date.setDate(cur_date.getDate()-180);
    this.formControls.minTestDate.setValue(cur_date)
  }

  goToRecordPage() {
    this.router.navigate(['record'], {queryParamsHandling: 'merge'}).then();
  }

  goToThankYouPage() {
    this.router.navigate(['thank-you'], {queryParamsHandling: 'merge'}).then();
  }

  srfIdValidator(control: FormControl) {
    if (control.parent && control.parent.controls['covidTestStatus'].value && control.parent.controls['covidTestStatus'].value == "ut") {
      let srfid = control.parent.controls['srf_id'].value;

      return (srfid.toString().length == 13) ? null : {'required': true}
    }
    return null;
  }

  setValidityHC1() {
    this.formControls.conditionStatus_1.setValue(null);
    let currentConditionStatus = false;
    const detailsRoot = this;
    this.optionList.currentHealthConditions1.forEach(function (item) {
      currentConditionStatus = currentConditionStatus || detailsRoot.formControls[item].value
    })
    currentConditionStatus = currentConditionStatus || this.formControls.none_1.value
    if (currentConditionStatus) {
      this.formControls.conditionStatus_1.setValue(true)
    }
  }

  setValidityHC2() {
    this.formControls.conditionStatus_2.setValue(null);
    let currentConditionStatus = false;
    const detailsRoot = this;
    this.optionList.currentHealthConditions2.forEach(function (item) {
      currentConditionStatus = currentConditionStatus || detailsRoot.formControls[item].value
    })
    currentConditionStatus = currentConditionStatus || this.formControls.none_2.value
    if (currentConditionStatus) {
      this.formControls.conditionStatus_2.setValue(true)
    }
  }
  setValidityRA() {
    this.formControls.conditionStatus_3.setValue(null);
    let currentConditionStatus = false;
    const detailsRoot = this;
    this.optionList.respAilments.forEach(function (item) {
      currentConditionStatus = currentConditionStatus || detailsRoot.formControls[item].value
    })
    currentConditionStatus = currentConditionStatus || this.formControls.none_3.value
    if (currentConditionStatus) {
      this.formControls.conditionStatus_3.setValue(true)
    }
  }

  setValidityPE() {
    this.formControls.conditionStatus_4.setValue(null);
    let currentConditionStatus = false;
    const detailsRoot = this;
    this.optionList.preexistingConditions.forEach(function (item) {
      currentConditionStatus = currentConditionStatus || detailsRoot.formControls[item].value
    })
    currentConditionStatus = currentConditionStatus || this.formControls.none_4.value
    if (currentConditionStatus) {
      this.formControls.conditionStatus_4.setValue(true)
    }
  }

  startOver() {
    this.submitLoader = true;
    firebase.auth().signOut().then();
  }

  submitData() {
    let detailsRoot = this;
    if (this.userData && this.formGroups.metadata.valid && this.formGroups.healthStatus.valid && this.formGroups.covidStatus.valid) {
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
        'test_status': this.formControls.covidTestStatus.value,
        'covid_status': this.formControls.currentStatus.value,
        'vacc': this.formControls.vaccinated.value,
        'smoker': this.formControls.smoker.value,
        'ctScan': this.formControls.ctScan.value
      };

      if (detailsRoot.formControls.locality.value) {
        userMetaData['l_l'] = detailsRoot.formControls.locality.value;
      }

      if (detailsRoot.formControls.srf_id.value) {
        userMetaData['srf_id'] = detailsRoot.formControls.srf_id.value;
      }

      if (detailsRoot.formControls.covidTestStatus.value !='na') {
        userMetaData['testType'] = detailsRoot.formControls.testType.value;
        let new_date = new Date(String(detailsRoot.formControls.testDate));
        userMetaData['test_date'] = formatDate(new_date, 'yyyy-MM-dd','en-GB');
      }

      if (detailsRoot.formControls.ctScan.value == 'y') {
        let new_date = new Date(String(detailsRoot.formControls.ctDate));
        userMetaData['ctDate'] = formatDate(new_date, 'yyyy-MM-dd','en-GB');
        userMetaData['ctScore'] = detailsRoot.formControls.ctScore.value;
      }

      if (detailsRoot.formControls.covidTestStatus.value == 'ut') {
          userMetaData['covid_status'] = 'under_validation';
      }

      if (detailsRoot.formControls.covidTestStatus.value == 'n') {
        if (detailsRoot.optionList.currentStatusList.indexOf(detailsRoot.formControls.currentStatus.value)==5) {
          userMetaData['covid_status'] = 'no_resp_illness_exposed';
        }
        else {
          if (detailsRoot.formControls.prior_status.value == 'p') {
            userMetaData['covid_status'] = 'recovered_full';
          }
          else {
            userMetaData['covid_status'] = 'healthy';
          }
        }
      }

      if (userMetaData['covid_status'] == 'healthy')
      {
        if (!this.formControls.none_3.value) {
          console.log("Inside resp illness")
          userMetaData['covid_status'] = 'resp_illness_not_identified';
        }
      }

      if (!this.formControls.none_1.value) {
        this.optionList.currentHealthConditions1.forEach(function (item) {
          if (detailsRoot.formControls[item].value) {
            userMetaData[item] = true;
          }
        })
      }

      if (!this.formControls.none_2.value) {
        this.optionList.currentHealthConditions2.forEach(function (item) {
          if (detailsRoot.formControls[item].value) {
            userMetaData[item] = true;
          }
        })
      }

      if (!this.formControls.none_3.value) {
        this.optionList.respAilments.forEach(function (item) {
          if (detailsRoot.formControls[item].value) {
            userMetaData[item] = true;
          }
        })
      }

      if (!this.formControls.none_4.value) {
        this.optionList.preexistingConditions.forEach(function (item) {
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

  resetCovidTestStatus() {
    this.formControls.currentStatus.reset();

    if (this.formControls.covidTestStatus.value !='ut') {
      this.formControls.srf_id.disable();
    } 
    else {
      this.formControls.srf_id.enable();
    }

    if (this.formControls.covidTestStatus.value =='na') {
      this.formControls.testType.disable();
      this.formControls.testDate.disable();
    } 
    else {
      this.formControls.testType.enable();
      this.formControls.testDate.enable();
    }

    if (this.formControls.covidTestStatus.value =='na' || this.formControls.covidTestStatus.value =='p') {
      this.formControls.prior_status.disable();
    }
    else {
      this.formControls.prior_status.enable();
    }
  }

  resetHealthConditions1Status() {
    const detailsRoot = this;
    if (this.formControls.none_1.value) {
      this.optionList.currentHealthConditions1.forEach(function (item) {
        detailsRoot.formControls[item].disable();
        detailsRoot.formControls[item].setValue(false);
      })
      this.formControls.conditionStatus_1.setValue(true)
    } else {
      this.optionList.currentHealthConditions1.forEach(function (item) {
        detailsRoot.formControls[item].enable();
      })
      this.formControls.conditionStatus_1.setValue(null)
    }
  }

  resetHealthConditions2Status() {
    const detailsRoot = this;
    if (this.formControls.none_2.value) {
      this.optionList.currentHealthConditions2.forEach(function (item) {
        detailsRoot.formControls[item].disable();
        detailsRoot.formControls[item].setValue(false);
      })
      this.formControls.conditionStatus_2.setValue(true)
    } else {
      this.optionList.currentHealthConditions2.forEach(function (item) {
        detailsRoot.formControls[item].enable();
      })
      this.formControls.conditionStatus_2.setValue(null)
    }
  }

  resetRespAilStatus() {
    const detailsRoot = this;
    if (this.formControls.none_3.value) {
      this.optionList.respAilments.forEach(function (item) {
        detailsRoot.formControls[item].disable();
        detailsRoot.formControls[item].setValue(false);
      })
      this.formControls.conditionStatus_3.setValue(true)
    } else {
      this.optionList.respAilments.forEach(function (item) {
        detailsRoot.formControls[item].enable();
      })
      this.formControls.conditionStatus_3.setValue(null)
    }
  }

  resetPreexistingStatus() {
    const detailsRoot = this;
    if (this.formControls.none_4.value) {
      this.optionList.preexistingConditions.forEach(function (item) {
        detailsRoot.formControls[item].disable();
        detailsRoot.formControls[item].setValue(false);
      })
      this.formControls.conditionStatus_4.setValue(true)
    } else {
      this.optionList.preexistingConditions.forEach(function (item) {
        detailsRoot.formControls[item].enable();
      })
      this.formControls.conditionStatus_4.setValue(null)
    }
  }
}
