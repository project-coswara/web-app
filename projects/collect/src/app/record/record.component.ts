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
  recordState:number = -1;
  titleDict = {
    'breathing-shallow': 'Breathing (shallow)',
    'breathing-deep': 'Breathing (deep)',
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
    'breathing-shallow': 'Breathe fast 5 times',
    'breathing-deep': 'Breathe deeply 5 times',
    'cough-shallow': 'Cough mildly 3 times',
    'cough-heavy': 'Cough deeply 3 times',
    'vowel-a': 'Say /a/ as in \'made\' and sustain as long as possible',
    'vowel-e': 'Say /e/ as in \'beet\' and sustain as long as possible',
    'vowel-o': 'Say /o/ as in \'cool\' and sustain as long as possible',
    'counting-normal': 'Count from 1 to 20',
    'counting-fast': 'Count from 1 to 20 faster',
    'done': 'Thank you for your participation!'
  };
  formControls = {
    'breathing-shallow': new FormControl(null, [Validators.required]),
    'breathing-deep': new FormControl(null, [Validators.required]),
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
  userAppData = null;
  uploadProgress = 0;
  timeoutVar = null;

  @ViewChild('stepper', {static: false}) private stepper: MatStepper;

  constructor(private router: Router, private userDataService: UserDataService) {
    this.userDataService.getUserData().subscribe(userData => {
      this.userData = userData;
    });

    this.userDataService.getAppData().subscribe(userAppData => {
      this.userAppData = userAppData;
      if (!userAppData || !userAppData['fMD']) {
        firebase.auth().signOut().then();
      } else if (userAppData && userAppData['cS']) {
        let nextIndex = this.recordStages.indexOf(userAppData['cS']) + 1;
        if (nextIndex >= this.recordStages.length - 1) {
          this.goToThankYouPage();
        }
        this.selectedStageIndex = nextIndex;
        this.stepLoader = false;
      } else {
        this.stepLoader = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.markStepsCompleted(Array.from(Array(this.selectedStageIndex).keys()));
    this.setSampleAudio(this.recordStages[this.selectedStageIndex]);
    this.stepper.selectionChange.subscribe((changeData) => {
      this.uploadProgress = 0;
      this.stopSamplePlaying();
      this.stopRecording();
      this.stopPlaying();
      this.initRecord();
      this.markStepsCompleted(Array.from(Array(changeData.selectedIndex).keys()));
      this.setSampleAudio(this.recordStages[changeData.selectedIndex]);
    });
  }

  ngOnInit() {
    this.initRecord();
  }

  initRecord() {
    let recordRoot = this;
    this.recordState = -1;

    navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
      this.recordState = 1;
      this.recorder = RecordRTC(stream, {
        disableLogs: true,
        type: 'audio',
        numberOfAudioChannels: 1,
        recorderType: RecordRTC.StereoAudioRecorder,
        desiredSampleRate: 16000
      });

      this.startRecording = function () {
        this.recorder.startRecording();
        this.timeoutVar = setTimeout(() => {
          console.log('stopRecordingTrigger');
          if (this.recordState == 2) {
            this.recordState = 3;
            this.stopRecording();
          }
        }, 30000);
      }

      this.stopRecording = function () {
        clearTimeout(this.timeoutVar);
        this.recorder.stopRecording(() => {
          const blob = this.recorder.getBlob();
          const metadata = {contentType: 'audio/wav'};
          this.recorder.reset();
          this.recordedAudio = new Audio();
          this.recordedAudio.src = URL.createObjectURL(blob);
          this.recordedAudio.load();
          this.recordedAudio.addEventListener("ended", () => {
            this.recordState = 3;
          });
          this.uploadAudio = function (stageId) {
            if (this.userData) {
              this.uploadProgress = 0;
              let upload_task = firebase.storage().ref()
                  .child('COLLECT_DATA')
                  .child(this.userAppData.dS)
                  .child(this.userData.uid)
                  .child(stageId + '.wav')
                  .put(blob, metadata);
              upload_task.on('state_changed', snapshot => {
                this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              }, error => {
                console.log(error["code"] + " - Please try again!");
                this.recordState = 3;
              })
              this.cancelUpload = function() {
                upload_task.cancel();
              }
              upload_task.then(function () {
                const db = firebase.firestore();
                const updateAppData = {
                  'cS': stageId,
                  'cSD': new Date().toISOString(),
                  'lV': environment.version,
                  'pred': stageId
                }
                db.collection('USER_APPDATA')
                    .doc(recordRoot.userData.uid)
                    .update(updateAppData).then(() => {
                  recordRoot.stepper.selected.completed = true;
                  recordRoot.stepper.selected.editable = false;
                  recordRoot.stepper.next();
                  recordRoot.userAppData = Object.assign(recordRoot.userAppData, updateAppData)
                });
                if (recordRoot.recordStages[recordRoot.recordStages.length - 2] == stageId) {
                  recordRoot.stepLoader = true;
                  updateAppData['cS'] = 'done';
                  updateAppData['pred'] = 'in_process';
                  const batch = db.batch();
                  batch.update(
                      db.collection('USER_APPDATA')
                          .doc(recordRoot.userData.uid),
                      updateAppData
                  );
                  batch.update(
                      db.collection('USER_METADATA')
                          .doc(recordRoot.userAppData.dS)
                          .collection('DATA')
                          .doc(recordRoot.userData.uid),
                      {'iF': true}
                  );
                  batch.set(
                      db.collection('SCORE_DATA')
                          .doc(recordRoot.userData.uid),
                      {
                        'dS': recordRoot.userAppData.dS,
                        'm': 'Initializing'
                      }
                  )
                  batch.commit().then(() => {
                    recordRoot.userAppData = Object.assign(recordRoot.userAppData, updateAppData)
                    recordRoot.userDataService.sendAppData(recordRoot.userAppData);
                    recordRoot.goToThankYouPage();
                  })
                } else {
                  recordRoot.stepper.next();
                }
              }).catch((error) => {
                console.error(error)
                if (error.code != 'storage/canceled') {
                  alert('Upload failed! Retry again');
                }
                recordRoot.recordState = 3;
              })
            }
          }
        });
      }
    }).catch((error) => {
      alert('Need microphone permissions to proceed! Please enable it in the browser settings.');
      this.router.navigate(['']).then();
      console.error(error);
    });
  }

  cancelUpload() { }

  goToThankYouPage() {
    this.router.navigate(['thank-you'], {queryParamsHandling: 'merge'}).then();
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

  startRecording() {

  }

  startSamplePlaying() {
    this.sampleAudio.play()
  }

  stopPlaying() {
    if (this.recordedAudio) {
      this.recordedAudio.pause();
      this.recordedAudio.currentTime = 0;
    }
  }

  stopRecording() {
  }

  stopSamplePlaying() {
    if (this.sampleAudio) {
      this.sampleAudio.pause();
      this.sampleAudio.currentTime = 0;
    }
  }

  uploadAudio(stageId) { }
}
