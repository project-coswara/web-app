import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { Router } from "@angular/router";

import * as RecordRTC from 'recordrtc'

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

import { UserDataService } from "../../../../../src/app/user-data.service";
import { environment } from "../../../../../src/environments/environment";
import {error} from "@angular/compiler/src/util";

@Component({
  selector: 'cs-record-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.less']
})

export class RecordComponent implements AfterViewInit, OnInit {
  userData = null;
  sampleAudio = null;
  recordedAudio = null;
  recorder = null;
  stepLoader: boolean = true;
  recordState:number = 1;
  titleDict = {
    'breathing-slow': 'Breathing (slow)',
    'breathing-fast': 'Breathing (deep)',
    'cough-shallow': 'Cough (shallow)',
    'cough-heavy': 'Cough (heavy)',
    'vowel-a': 'Vowel /a/',
    'vowel-e': 'Vowel /e/',
    'vowel-o': 'Vowel /o/',
    'counting-normal': 'Counting (normal)',
    'counting-fast': 'Counting (fast)',
    'done': 'Finished'
  };
  instructionDict = {
    'breathing-slow': 'Breathe slowly 5 times close to the microphone',
    'breathing-fast': 'Breathe deeply 5 times close to the microphone',
    'cough-shallow': 'Cough mildly 3 times close to the microphone',
    'cough-heavy': 'Cough deeply 3 times close to the microphone',
    'vowel-a': 'Say /a/ as in \'made\' and sustain as long as possible',
    'vowel-e': 'Say /e/ as in \'beet\' and sustain as long as possible',
    'vowel-o': 'Say /o/ as in \'cool\' and sustain as long as possible',
    'counting-normal': 'Count from 1 to 20',
    'counting-fast': 'Count from 1 to 20 faster',
    'done': 'Thank you for your participation!'
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
          'uT': 'anonymous',
          'fUV': environment.version
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
        numberOfAudioChannels: 1,
        recorderType: RecordRTC.StereoAudioRecorder,
        desiredSampleRate: 16000
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
                    let cSD = new Date().toISOString();
                    firebase.firestore().collection('USERS').doc(recordRoot.userData.uid)
                        .update({
                          'cS': stageId,
                          'cSD': cSD,
                          'lUV': environment.version
                        }).then();
                    recordRoot.stepper.selected.completed = true;
                    recordRoot.stepper.selected.editable = false;
                    recordRoot.stepper.next();
                    recordRoot.userMetaData['cS'] = stageId;
                    recordRoot.userMetaData['cSD'] = new Date().toISOString();
                    recordRoot.userMetaData['lUV'] = environment.version;
                    if (recordRoot.recordStages[recordRoot.recordStages.length - 2] == stageId) {
                      firebase.firestore().collection('USERS').doc(recordRoot.userData.uid)
                          .update({
                            'cS': 'done',
                            'cSD': cSD
                          }).then();
                      recordRoot.userMetaData['cS'] = 'done';
                      recordRoot.userMetaData['cSD'] = cSD;
                      recordRoot.userMetaData['lUV'] = environment.version;
                      recordRoot.userDataService.sendMetaData(recordRoot.userMetaData);
                      recorder.microphone.stop();
                      recordRoot.goToThankYouPage();
                    } else {
                      recordRoot.stepper.next();
                    }
              })
            }
          }
        });
      }
    }).catch((error) => {
      alert('Need microphone permissions to proceed!');
      this.router.navigate(['']).then();
      console.error(error);
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
