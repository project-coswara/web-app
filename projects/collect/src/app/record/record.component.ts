import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { MatStepper } from "@angular/material/stepper";

import * as RecordRTC from 'recordrtc'
import * as firebase from 'firebase/app';
import 'firebase/storage';

@Component({
  selector: 'cs-record-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.less']
})
export class RecordComponent implements OnInit {
  userId: string;
  stage: string;
  currentTitle: string;
  sampleAudio: any;
  selectedStep: number = 0;
  @ViewChild('stepper', {static: false}) private audioStepper: MatStepper;
  isSamplePlaying: Boolean = false;
  isRecoding: Boolean = false;
  isUploading: Boolean = false;

  titleDict = {
    'breathing-slow': 'Breathing (slow)',
    'breathing-fast': 'Breathing (fast)',
    'cough-shallow': 'Cough (shallow)',
    'cough-heavy': 'Cough (heavy)',
    'speech-short': 'Speech (short)',
    'speech-long': 'Speech (long)',
    'counting-normal': 'Counting (normal)',
    'counting-fast': 'Counting (fast)',
  };

  countsDict = {
    'breathing-slow': 5,
    'breathing-fast': 5,
    'cough-shallow': 5,
    'cough-heavy': 5,
    'speech-short': 3,
    'speech-long': 3,
    'counting-normal': 2,
    'counting-fast': 2,
  };

  pageOrder = Object.keys(this.titleDict);
  currentPage = 0;
  recordSteps = [];

  constructor(private changeRef: ChangeDetectorRef, private ngZone: NgZone, private router: Router, private route: ActivatedRoute) {
    route.params.subscribe(val => {
      this.stage = val.stage;
      this.currentTitle = this.titleDict[val.stage];
      this.currentPage = this.pageOrder.indexOf(val.stage);
      this.selectedStep = 0;
      this.recordSteps = Array.from(Array(this.countsDict[val.stage]).keys());
      this.sampleAudio = new Audio();
      this.sampleAudio.src = '../../assets/samples/male/' + val.stage +'.wav';
      this.sampleAudio.load();

      this.sampleAudio.addEventListener("ended", () => {
        this.isSamplePlaying = false;
      });

      if(this.audioStepper) {
        this.audioStepper.reset();
      }
    });
  }

  ngOnInit() {
    let record_root = this;

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        record_root.userId = user.uid;
      }
    });

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      let recorder = RecordRTC(stream, {
        disableLogs: true,
        type: 'audio',
        mimeType: 'audio/wav',
        audioBitsPerSecond: 128000,
        sampleRate: 96000
      });

      this.startRecording = function() {
        record_root.isRecoding = true;
        recorder.startRecording();
        record_root.changeRef.detectChanges();
      };

      this.stopRecording = function () {
        recorder.stopRecording(function () {
          const blob = recorder.getBlob();
          const metadata = {contentType: 'audio/wav',};
          recorder.reset();
          record_root.isRecoding = false;
          record_root.isUploading = true;
          record_root.changeRef.detectChanges();
          firebase.storage()
              .ref()
              .child('collect')
              .child(record_root.userId)
              .child(record_root.stage)
              .child('sample' + (record_root.selectedStep + 1) + '.wav')
              .put(blob, metadata).then(function () {
                console.debug(record_root.stage + ': Step ' + record_root.selectedStep + ' - Audio uploaded');
                record_root.isUploading = false;
                if(record_root.selectedStep == record_root.recordSteps.length - 1) {
                  record_root.goToNextPage(record_root.currentPage);
                  record_root.selectedStep = 0;
                } else {
                  record_root.audioStepper.selected.editable = false;
                  record_root.audioStepper.selected.completed = true;
                  // record_root.audioStepper.next();
                  record_root.selectedStep += 1
                }
                record_root.changeRef.detectChanges();
              }).catch(function (error) {
                console.error(error)
              });
        });
      }
    });
  }

  startRecording() {
    console.log('Recorder not initialized');
  }

  stopRecording() {
    console.log('Recorder not initialized');
  }

  playSampleAudio() {
    this.isSamplePlaying = true;
    this.sampleAudio.play();
  }

  stopSampleAudio() {
    this.sampleAudio.pause();
    this.sampleAudio.currentTime = 0;
    this.isSamplePlaying = false;
  }

  goToNextPage(currentPageIndex) {
    let routeParams = ['thank-you'];
    if(currentPageIndex < this.pageOrder.length - 1) {
      routeParams = ['record', this.pageOrder[currentPageIndex + 1]];
    }
    this.ngZone.run(() => this.router.navigate(routeParams)).then();
  }
}
