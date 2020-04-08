import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { Router } from "@angular/router";

import * as RecordRTC from 'recordrtc'

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

import { UserDataService } from "../../../../../src/app/user-data.service";

@Component({
  selector: 'cs-record-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.less']
})

export class RecordComponent implements AfterViewInit, OnInit {
  userData = null;
  sampleAudio = null;
  recordedAudio = null;
  stepLoader: boolean = true;
  recordState:number = 1;
  titleDict = {
    'breathing-slow': 'Breathing (slow)',
    'breathing-fast': 'Breathing (fast)',
    'cough-shallow': 'Cough (shallow)',
    'cough-heavy': 'Cough (heavy)',
    'vowel-a': 'Vowel /a/',
    'vowel-e': 'Vowel /e/',
    'vowel-o': 'Vowel /o/',
    'counting-normal': 'Counting (normal)',
    'counting-fast': 'Counting (fast)',
    'done': 'Finished'
  };
  formControls = {
    'breathing-slow': new FormControl(null, [Validators.required]),
    'breathing-fast': new FormControl(null, [Validators.required]),
    'cough-shallow': new FormControl(null, [Validators.required]),
    'cough-heavy': new FormControl(null, [Validators.required]),
    'vowel-a': new FormControl(null, [Validators.required]),
    'vowel-e': new FormControl(null, [Validators.required]),
    'vowel-o': new FormControl(null, [Validators.required]),
    'counting-normal': new FormControl(null, [Validators.required]),
    'counting-fast': new FormControl(null, [Validators.required]),
    'done': new FormControl(null, [Validators.required])
  };
  recordStages = Object.keys(this.titleDict);
  selectedStageIndex: number = 0;
  userMetaData = null;

  @ViewChild('stepper', {static: false}) private stepper: MatStepper;

  constructor(private router: Router, private userDataService: UserDataService) {
    this.userDataService.getUserData().subscribe(userData => {
      this.userData = userData;
    });

    this.userDataService.getMetaData().subscribe(metaData => {
      if (metaData && metaData['cS']) {
        this.userMetaData = metaData;
        let nextIndex = this.recordStages.indexOf(metaData['cS']) + 1;
        if (nextIndex >= this.recordStages.length - 1) {
          this.goToThankYouPage();
        } else {
          this.selectedStageIndex = nextIndex;
        }
      } else {
        this.userMetaData = {
          'aMD': true,
          'uT': 'anonymous'
        };
      }
      this.stepLoader = false;
    });
  }

  ngAfterViewInit(): void {
    this.markStepsCompleted(Array.from(Array(this.selectedStageIndex).keys()));
    this.setSampleAudio(this.recordStages[this.selectedStageIndex]);
    this.stepper.selectionChange.subscribe((changeData) => {
      this.recordState = 1;
      this.stopSamplePlaying();
      this.stopRecording();
      this.stopPlaying();
      this.markStepsCompleted(Array.from(Array(changeData.selectedIndex).keys()));
      this.setSampleAudio(this.recordStages[changeData.selectedIndex]);
    });
  }

  ngOnInit() {
    let recordRoot = this;
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      let recorder = RecordRTC(stream, {
        disableLogs: true,
        type: 'audio',
        mimeType: 'audio/wav',
        audioBitsPerSecond: 128000,
        sampleRate: 96000
      });

      this.startRecording = function() {
        recorder.startRecording()
      };

      this.stopRecording = function () {
        recorder.stopRecording(() => {
          const blob = recorder.getBlob();
          const metadata = {contentType: 'audio/wav',};
          recorder.reset();
          this.recordedAudio = new Audio();
          this.recordedAudio.src = URL.createObjectURL(blob);
          this.recordedAudio.load();
          this.recordedAudio.addEventListener("ended", () => {
            this.recordState = 3;
          });
          this.uploadAudio = function (stageId) {
            if (this.userData) {
              firebase.storage().ref().child('AUDIO_DATA').child(this.userData.uid).child(stageId + '.wav')
                  .put(blob, metadata).then(function () {
                    firebase.firestore().collection('USERS').doc(recordRoot.userData.uid)
                        .update({
                          'cS': stageId
                        }).then();
                    recordRoot.stepper.selected.completed = true;
                    recordRoot.stepper.selected.editable = false;
                    recordRoot.stepper.next();
                    recordRoot.userMetaData['cS'] = stageId;
                    if (recordRoot.recordStages[recordRoot.recordStages.length - 2] == stageId) {
                      firebase.firestore().collection('USERS').doc(recordRoot.userData.uid)
                          .update({
                            'cS': 'done'
                          }).then();
                      recordRoot.userMetaData['cS'] = 'done';
                      recordRoot.userDataService.sendMetaData(recordRoot.userMetaData);
                      recordRoot.goToThankYouPage();
                    } else {
                      recordRoot.stepper.next();
                    }
              }).catch(function (error) {
                console.error(error)
              });
            }
          }
        });
      }
    });
  }

  goToThankYouPage() {
    this.router.navigate(['thank-you']).then();
  }

  markStepsCompleted(steps) {
    this.stepper.steps.forEach((item, index) => {
      if (steps.indexOf(index) != -1) {
        item.completed = true;
        item.editable = false;
      }
    })
  }

  setSampleAudio(stageId) {
    if (stageId != 'done') {
      this.sampleAudio = new Audio();
      this.sampleAudio.src = '../../assets/samples/male/' + stageId +'.mp3';
      this.sampleAudio.load();
      this.sampleAudio.addEventListener("ended", () => {
        this.recordState = 1;
      });
    }
  }

  startPlaying() {
    this.recordedAudio.play()
  }

  startRecording() { }

  startSamplePlaying() {
    this.sampleAudio.play()
  }

  stopPlaying() {
    if (this.recordedAudio) {
      this.recordedAudio.pause();
      this.recordedAudio.currentTime = 0;
    }
  }

  stopRecording() { }

  stopSamplePlaying() {
    if (this.sampleAudio) {
      this.sampleAudio.pause();
      this.sampleAudio.currentTime = 0;
    }
  }

  uploadAudio(stageId) { }
}
