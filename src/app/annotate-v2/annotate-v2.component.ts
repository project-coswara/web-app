import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import * as WaveSurfer from 'wavesurfer.js';
import * as WaveSurferTimeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.js';
import * as WaveSurferSpectrogram from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram.js';
import * as WaveSurferRegions from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import * as WaveSurferMinimap from 'wavesurfer.js/dist/plugin/wavesurfer.minimap.js';
import {UserDataService} from "../user-data.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'cs-annotate-v2',
  templateUrl: './annotate-v2.component.html',
  styleUrls: ['./annotate-v2.component.less']
})

export class AnnotateV2Component implements OnInit, AfterViewInit {
  userData = null;
  isEnoughPermissions = false;
  annotateLoader = true;
  annotatedStageLoader = true;
  recordingAudio = null;
  recordingAudioProgress = 0;
  recordingAudioState = -1;
  currentStage = null;
  participantId = null;
  dateString = null;
  playedOnce = 0;
  timeOut = false;
  timeOutObject = null;
  showSkipOption = false;
  waveSurfer = null
  timeline = null
  spectrogram = null
  regions_list = null

  titleDict = {
    'breathing-shallow': 'Breathing (shallow)',
    'breathing-deep': 'Breathing (deep)',
    'cough-shallow': 'Cough (shallow)',
    'cough-heavy': 'Cough (heavy)',
    'vowel-a': 'Vowel /a/',
    'vowel-e': 'Vowel /e/',
    'vowel-o': 'Vowel /o/',
    'counting-normal': 'Counting (normal)',
    'counting-fast': 'Counting (fast)'
  };

  recordStages = Object.keys(this.titleDict);
  formControls = {
    extraComments: new FormControl(null),
  }
  annotateFormGroup = new FormGroup({
    extraComments: this.formControls.extraComments
  })
  annotatorRef = null;
  annotatorInfo = {
    completed: 0,
    n: 'Annotator Master'
  }
  db = firebase.firestore();

  constructor(private route: ActivatedRoute, private router: Router, private userDataService: UserDataService) {
    this.userDataService.getUserData().subscribe((userData) => {
      if (userData) {
        if (userData.uid) {
          this.userData = userData;
          this.isEnoughPermissions = true;
          this.annotatorRef = firebase.firestore().collection('ANNOTATE_APPDATA').doc(this.userData.uid);
          this.getAnnotatorData((annotatorInfo, currentDoc) => {
            if (annotatorInfo) {
              this.annotatorInfo = annotatorInfo
            } else {
              this.annotatorInfo['n'] = this.userData.name;
              this.annotatorInfo['e'] = this.userData.email;
              this.annotatorInfo['pURL'] = this.userData.photoURL;
              this.annotatorRef.set(this.annotatorInfo).then();
            }
            if (currentDoc) {
              this.participantId = currentDoc.id;
              this.currentStage = currentDoc.data()['cS'];
              this.dateString = currentDoc.data()['dS'];
              this.populateData(this.participantId, this.currentStage, this.dateString);
              this.annotateLoader = false;
            } else {
              this.setupAnnotation(() => {
                this.annotateLoader = false;
              })
            }
          })
        }
      } else {
        this.route.url.subscribe((url) => {
          if (url) {
            this.router.navigate(['login'], {queryParams: {redirect: url}}).then()
          }
        })
      }
    });
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.waveSurfer = WaveSurfer.create({
      container: '#waves',
      waveColor: '#FF00FF',
      progressColor: 'purple',
      loaderColor: 'purple',
      cursorColor: 'navy',
      height: 256,
      maxCanvasWidth: 8000,
      backend: 'MediaElement',
      minimap: true,
      plugins:[WaveSurferMinimap.create({height: 30,
        waveColor: '#dddddd',
        progressColor: '#999',
        cursorColor: '#999'}),
        WaveSurferTimeline.create({container:"#wavetimeline"}),
        // WaveSurferSpectrogram.create({container: "#spectrogram", 
        // fftSamples: 512,
        // label: true,
        // windowFunc: 'bartlett'}),
        WaveSurferRegions.create()],
      xhr: {
        cache: "default",
        mode: "no-cors",
        method: "GET",
        credentials: "include",
        headers: [
          { key: "cache-control", value: "no-cache" },
          { key: "pragma", value: "no-cache" },
        ]
      }
    });
    // this.spectrogram = WaveSurferSpectrogram.create({ //this.spectrogram = 
    //   wavesurfer: this.waveSurfer,
    //   container: "#spectrogram",
    //   fftSamples: 512,
    //   label: true,
    //   windowFunc: 'bartlett'
    // });
    // this.timeline = WaveSurfer.Timeline.init({wavesurfer: this.waveSurfer, container: '#wavetimeline'});
    // //var spectrogramColorMap = colormap({ colormap: magma, nshades: 256, format: 'rgb',alpha: 1});
    // this.timeline = Object.create(WaveSurferTimeline);
    this.spectrogram = Object.create(WaveSurferSpectrogram);
  }

  getAnnotatorData(callback) {
    if (this.annotatorRef) {
      Promise.all([
        this.annotatorRef.get(),
        this.annotatorRef.collection('DATA').where('fA', '==', false).limit(1).get()
      ]).then((snapshots) => {
        callback(snapshots[0].data(), snapshots[1].docs[0])
      })
    }
  }

  nextRecording() {
    const annotateRoot = this;
    this.stopPlaying();
    this.annotatedStageLoader = true;
    this.recordingAudioState = -1;
    let id_names_array = [];
    let start_of_region = [];
    let end_of_region = [];
    let region_timings = {};
    const regions_ids_array = Object.keys(this.regions_list);

    // Renaming regions and storing it in a separate array.
    for (let i = 0; i < regions_ids_array.length; i++) {
      let l = i + 1;
      id_names_array[i] = "Region" + l; //new names for ID's for record purpose.
    }


    for (let i = 0; i < regions_ids_array.length; i++) {
      end_of_region[i] = Object.values(this.regions_list)[i]["end"];
      start_of_region[i] = Object.values(this.regions_list)[i]["start"];

    }

    if (this.annotatorRef) {
      const stageParams = {}
      for (let i = 0; i < regions_ids_array.length; i++) {
        let l = i + 1;
        stageParams["start_of_region" + l] = start_of_region[i];
        stageParams["end_of_region" + l] = end_of_region[i];
      }
      if (this.formControls.extraComments.value) {
        stageParams['comments'] = this.formControls.extraComments.value
      }
      stageParams['annotator_name'] = this.annotatorInfo['n']
      const nextStageIndex = this.recordStages.indexOf(this.currentStage) + 1;
      const nextStage = nextStageIndex > this.recordStages.length - 1 ? 'verified' : this.recordStages[nextStageIndex]
      const batch = firebase.firestore().batch();
      batch.update(
        this.annotatorRef.collection('DATA').doc(this.participantId),
        {'cS': nextStage, 'fA': nextStage == 'verified'}
      )
      if (nextStage == 'verified') {
        this.annotatorInfo.completed += 1
        batch.update(
          this.annotatorRef,
          {'completed': this.annotatorInfo.completed}
        )
        batch.update(
          firebase.firestore().collection('USER_APPDATA').doc(this.participantId),
          {'cS': 'verified_v2'}
        )
      }
      const jsonBlob = new Blob([JSON.stringify(stageParams, null, 4)], {type: "application/json"})
      Promise.all([
        batch.commit(),
        firebase.storage().ref('ANNOTATE_DATA').child(this.dateString).child(this.participantId)
          .child(`${this.currentStage}_v2.json`).put(jsonBlob)
      ]).then(() => {
        if (nextStage == 'verified') {
          annotateRoot.annotateLoader = true;
          annotateRoot.setupAnnotation(() => {
            annotateRoot.annotateLoader = false
          })
        } else {
          annotateRoot.currentStage = nextStage;
          annotateRoot.populateData(this.participantId, nextStage, annotateRoot.dateString);
        }
      })
    }
  }

  onBadAudioChange() {
    // this.formControls.volumeOkay.setValue('n');
    // this.formControls.continuousAudio.setValue('n');
  }
  
  updateAudioProgress() {
    console.log('updateAudioProgress')
    const buffered = this.recordingAudio.buffered;
    console.log(buffered)
    if (buffered.length) {
      this.recordingAudioProgress = this.recordingAudio.duration;
    }
    setTimeout(this.updateAudioProgress, 50)
  }

  populateData(participantId, currentStage, dateString) {
    this.resetForm();
    // participantId = 'SG95RAgm0wY3bzyIZPPSpHwyYuD3'
    // currentStage = 'breathing-shallow'
    // dateString = '2020-04-14'
    this.recordingAudioState = -1;
    firebase.storage().ref(`COLLECT_DATA/${dateString}/${participantId}/${currentStage}.wav`)
      .getDownloadURL().then((url) => {
      this.showSkipOption = false;
      this.timeOut = false;
      this.recordingAudio = new Audio()
      this.recordingAudio.src = url;
      // let audio = new Audio(url)


      this.playedOnce = 0;
      this.recordingAudioState = 0;
      // this.waveSurfer.on('ready', () => {
      //   if (this.waveSurfer.getDuration() == Infinity) {
      //     this.skipToNextUser('zero_duration')
      //   } else if (this.waveSurfer.getDuration > 120) {
      //     this.showSkipOption = true;
      //   }
        // this.waveSurfer.play()
        // this.timeline.init({wavesurfer: this.waveSurfer, container: '#wavetimeline'});
        // //var spectrogramColorMap = colormap({ colormap: magma, nshades: 256, format: 'rgb',alpha: 1});
        // this.spectrogram.init({
        //   wavesurfer: this.waveSurfer,
        //   container: "#spectrogram",
        //   fftSamples: 512,
        //   label: true,
        //   windowFunc: 'bartlett'
        // });
        // this.waveSurfer.enableDragSelection({});

        // this.regions_list = this.waveSurfer.regions.list;
        //regions_list is an object...!!

      // });
      // this.recordingAudio.addEventListener("loadeddata", () => {
      // this.recordingAudioState = 0;
      // });
      // this.recordingAudio.addEventListener("loadedmetadata", () => {
      //   if (this.recordingAudio.duration == Infinity) {
      //     this.skipToNextUser('zero_duration')
      //   }

      // });

      // this.recordingAudio.addEventListener("ended", () => {
      // this.recordingAudioState = 1;
      // this.playedOnce += 1;
      // });
      // this.recordingAudio.load()
      this.annotatedStageLoader = false;
      // this.updateAudioProgress();
    }).catch((error) => {
      if (error.code === 'storage/object-not-found') {
        this.skipToNextUser('no_audio');
      }
    })
  }

  resetForm() {
    // this.formControls.volumeOkay.setValue('y');
    // this.formControls.continuousAudio.setValue('y');
    // this.formControls.audioQuality.setValue('clean_audio');
    // this.formControls.audioCategory.setValue(this.currentStage);
    this.formControls.extraComments.setValue(null);
  }

  setupAnnotation(callback) {
    const annotateRoot = this;
    firebase.firestore().collection('USER_APPDATA')
      .where('cS', '==', 'verified')
      .orderBy('p')
      // .where('dS', '<=', '2020-05-06')
      .limit(1).get().then((snapshot) => {
      const userAppDataDoc = snapshot.docs[0]
      // console.log(userAppDataDoc.id, userAppDataDoc.data(), userAppDataDoc.ref)
      Promise.all([
        firebase.firestore().runTransaction((transaction) => {
          return transaction.get(userAppDataDoc.ref).then(() => {
            transaction.update(userAppDataDoc.ref, {'cS': 'verification_in_process', 'aU': annotateRoot.userData.uid})
          })
        }),
        firebase.firestore().collection('ANNOTATE_APPDATA')
          .doc(this.userData.uid).collection('DATA')
          .doc(userAppDataDoc.id).set({
          'cS': annotateRoot.recordStages[0],
          'dS': userAppDataDoc.data()['dS'],
          'fA': false
        })
      ]).then(() => {
        annotateRoot.participantId = userAppDataDoc.id;
        annotateRoot.currentStage = annotateRoot.recordStages[0];
        annotateRoot.dateString = userAppDataDoc.data()['dS'];
        annotateRoot.populateData(annotateRoot.participantId, annotateRoot.currentStage, annotateRoot.dateString);
        callback(true)
      });
    })
  }

  skipToNextUser(comment: string) {
    const annotateRoot = this;
    this.annotateLoader = true;
    const batch = this.db.batch();
    batch.update(
      this.db.collection('ANNOTATE_APPDATA').doc(this.userData.uid)
        .collection('DATA').doc(this.participantId),
      {fA: true, comment: comment}
    )
    batch.set(
      this.db.collection('ANNOTATE_ERRORS').doc(this.participantId),
      {
        comment: comment,
        aU: this.userData.uid,
        n: this.userData.name,
        stage: this.currentStage
      }
    )
    batch.commit().then(() => {
      annotateRoot.setupAnnotation(() => {
        annotateRoot.annotateLoader = false;
      })
    })
  }

  clearRegions(){
    if(this.waveSurfer)
    {
      this.waveSurfer.clearRegions()
      this.timeOut = false;
      clearTimeout(this.timeOutObject);
      this.waveSurfer.pause()
      this.waveSurfer.seekTo(0)
    }
  }

  startPlaying() {
    this.waveSurfer.load(this.recordingAudio)
    // this.waveSurfer.backend.ac.resume();
    this.waveSurfer.on('ready', () => {
      if (this.waveSurfer.getDuration() == Infinity) {
        this.skipToNextUser('zero_duration')
      } else if (this.waveSurfer.getDuration > 120) {
        this.showSkipOption = true;
      }

      // WaveSurferSpectrogram.create({ //this.spectrogram = 
      //   wavesurfer: this.waveSurfer,
      //   container: "#spectrogram",
      //   fftSamples: 512,
      //   label: true,
      //   windowFunc: 'bartlett'
      // });
      // this.spectrogram = Object.create(WaveSurfer.Spectrogram);
      this.spectrogram.create({
        wavesurfer: this.waveSurfer,
        container: "#spectrogram",
        fftSamples: 512,
        label: true,
        windowFunc: 'bartlett'
      });
      this.waveSurfer.playPause()
      // this.timeline = WaveSurferTimeline.create({wavesurfer: this.waveSurfer, container: '#wavetimeline'})
      // this.timeline.init({wavesurfer: this.waveSurfer, container: '#wavetimeline'});
      //var spectrogramColorMap = colormap({ colormap: magma, nshades: 256, format: 'rgb',alpha: 1});

      this.waveSurfer.enableDragSelection({});

      this.regions_list = this.waveSurfer.regions.list;
      //regions_list is an object...!!

    });

    this.waveSurfer.on('region-click', function (region, ee) {
      ee.stopPropagation();
      // Play on click, loop on shift click
      ee.shiftKey ? region.playLoop() : region.play();
    });
    this.waveSurfer.on('finish', () => {
      this.recordingAudioState = 1;
      this.playedOnce += 1;

    });
    this.timeOutObject = setTimeout(() => {
      this.timeOut = true;
    }, 10000)
  }

  stopPlaying() {
    // if (this.recordingAudio) {
    // this.timeOut = false;
    // clearTimeout(this.timeOutObject);
    // this.recordingAudio.pause();
    // this.recordingAudio.currentTime = 0;
    // }
    if (this.waveSurfer) {
      this.timeOut = false;
      clearTimeout(this.timeOutObject);
      this.waveSurfer.seekTo(0)
      this.waveSurfer.pause()


    }
  }

  previousRecording() {
    const currentStageIndex = this.recordStages.indexOf(this.currentStage)
    if (currentStageIndex > 0) {
      this.stopPlaying();
      this.annotatedStageLoader = true;
      this.currentStage = this.recordStages[currentStageIndex - 1];
      this.populateData(this.participantId, this.currentStage, this.dateString);
    }
  }
}

