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
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'cs-annotate-v2-test',
  templateUrl: './annotate-v2-test.component.html',
  styleUrls: ['./annotate-v2-test.component.less']
})

export class AnnotateV2TestComponent implements OnInit, AfterViewInit {
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
  spectrogram = null
  regions_list = null
  spectrogramFlag = false;
  testDone = false;
  testIDs =  ['KmMFugVd4Pa4fZW9FqWFcHBVovf2','V2l1rcUUl3VsRmbvIWuaazcBMF12'];
  enablePlayButton = false;

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
    volumeOkay: new FormControl('y', [Validators.required]),
    continuousAudio: new FormControl('y', [Validators.required]),
    audioQuality: new FormControl('clean_audio', [Validators.required]),
    audioCategory: new FormControl(this.recordStages[0], [Validators.required]),
    extraComments: new FormControl(null),
  }
  annotateFormGroup = new FormGroup({
    volumeOkay: this.formControls.volumeOkay,
    continuousAudio: this.formControls.continuousAudio,
    audioQuality: this.formControls.audioQuality,
    audioCategory: this.formControls.audioCategory,
    extraComments: this.formControls.extraComments
  })
  annotatorRef = null;
  annotatorInfo = {
    completed_test: 0,
    completed_v2:0,
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
              this.currentStage = currentDoc.data()['ver_test'];
              this.dateString = currentDoc.data()['dS'];
              this.populateData(this.participantId, this.currentStage, this.dateString);
              this.annotateLoader = false;
            } else {
              if (annotatorInfo['completed_test'] == 2)
              {
                this.annotateLoader = true;
                this.testDone = true;
              }
              else{
              this.setupAnnotation(() => {
                this.annotateLoader = false;
              })
            }
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
    requestAnimationFrame(() => {
    this.waveSurfer = WaveSurfer.create({
      container: '#waves',
      waveColor: '#FF00FF',
      progressColor: 'purple',
      loaderColor: 'purple',
      cursorColor: 'navy',
      height: 100,
      // maxCanvasWidth: 100,
      backend: 'MediaElement',
      // minimap: true,
      plugins:[WaveSurferRegions.create(),//WaveSurferMinimap.create({height: 30,
        // waveColor: '#dddddd',
        // progressColor: '#999',
        // cursorColor: '#999'}),
        WaveSurferTimeline.create({container:"#wavetimeline"}),
        // WaveSurferSpectrogram.create({container: "#spectrogram", 
        // fftSamples: 512,
        // label: true,
        // windowFunc: 'bartlett'}),
        ],
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
  });
    // this.timeline = WaveSurfer.Timeline.init({wavesurfer: this.waveSurfer, container: '#wavetimeline'});
    // //var spectrogramColorMap = colormap({ colormap: magma, nshades: 256, format: 'rgb',alpha: 1});
    // this.timeline = Object.create(WaveSurferTimeline);
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
    this.enablePlayButton = false;
    const annotateRoot = this;
    this.stopPlaying();
    this.annotatedStageLoader = true;
    this.recordingAudioState = -1;
    let id_names_array = [];
    let start_of_region = [];
    let end_of_region = [];
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
      const stageParams = {
        'vol': this.formControls.volumeOkay.value,
        'cont': this.formControls.continuousAudio.value,
        'quality': this.formControls.audioQuality.value,
        'stage': this.formControls.audioCategory.value,
        // 'regions_ids_array_keys':Object.keys(this.regions_list),
        // 'regions_ids_array_values':Object.values(this.regions_list)
      }
      for (let i = 0; i < regions_ids_array.length; i++) {
        let l = i + 1;
        stageParams["start_" + l] = Number(start_of_region[i].toFixed(3));
        stageParams["end_" + l] = Number(end_of_region[i].toFixed(3));
      }
      if (this.formControls.extraComments.value) {
        stageParams['comments'] = this.formControls.extraComments.value
      }
      stageParams['annotator_name'] = this.annotatorInfo['n']
      const nextStageIndex = this.recordStages.indexOf(this.currentStage) + 1;
      const nextStage = nextStageIndex > this.recordStages.length - 1 ? 'img_uploaded' : this.recordStages[nextStageIndex]
      const batch = firebase.firestore().batch();
      batch.update(
        this.annotatorRef.collection('DATA').doc(this.participantId),
        {'ver_test': nextStage, 'fA': nextStage == 'img_uploaded'}
      )
      if (nextStage == 'img_uploaded') {
        this.annotatorInfo.completed_test += 1
        batch.update(
          this.annotatorRef,
          {'completed_test': this.annotatorInfo.completed_test}
        )
        batch.update(
          // firebase.firestore().collection('ANNOTATE_APPDATA').child(this.annotatorRef.)doc(this.participantId),
          // {'ver_test': 'img_uploaded'}
          this.annotatorRef.collection('DATA').doc(this.participantId),
          {'ver_test': 'verified_test'}
        )
      }
      const jsonBlob = new Blob([JSON.stringify(stageParams, null, 4)], {type: "application/json"})
      Promise.all([
        batch.commit(),
        firebase.storage().ref('ANNOTATE_TEST_DATA').child('ANNOTATIONS').child(this.participantId)
          .child(`${this.currentStage}_${this.annotatorInfo['n'].split(" ")[0]}.json`).put(jsonBlob)
      ]).then(() => {
        if (this.annotatorInfo['completed_test'] == 2) {
          annotateRoot.annotateLoader = true;
          annotateRoot.testDone = true;
        }
        else{
        if (nextStage == 'img_uploaded') {
          annotateRoot.annotateLoader = true;
          annotateRoot.setupAnnotation(() => {
            annotateRoot.annotateLoader = false
          })
        } 

          else{
          annotateRoot.currentStage = nextStage;
          annotateRoot.populateData(this.participantId, nextStage, annotateRoot.dateString);
          }
        }
      })
      this.clearRegions();
    }
  }

  onBadAudioChange() {
    this.formControls.volumeOkay.setValue('n');
    this.formControls.continuousAudio.setValue('n');
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
    // participantId = '0zexHIcM7tQDdnFiEj2Eb0v3g212'
    // currentStage = 'breathing-shallow'
    // dateString = '2020-04-13'
    this.recordingAudioState = -1;
    firebase.storage().ref(`ANNOTATE_TEST_DATA/${participantId}/${currentStage}.wav`)
      .getDownloadURL().then((url) => {
      this.showSkipOption = false;
      this.timeOut = false;
      this.recordingAudio = new Audio()
      this.recordingAudio.src = url;
      // let audio = new Audio(url)
      this.playedOnce = 0;
      this.recordingAudioState = 0;
      this.waveSurfer.load(this.recordingAudio)
      this.waveSurfer.on('ready', () => {
        if (this.waveSurfer.getDuration() == Infinity) {
          this.skipToNextUser('zero_duration')
        } else if (this.waveSurfer.getDuration > 120) {
          this.showSkipOption = true;
        }
        // document.getElementById("waves").style.display = '';

        // Draw the waves
        // this.waveSurfer.drawBuffer();
        // this.waveSurfer.playPause()
        // this.timeline = WaveSurferTimeline.create({wavesurfer: this.waveSurfer, container: '#wavetimeline'})
        // this.timeline.init({wavesurfer: this.waveSurfer, container: '#wavetimeline'});
        //var spectrogramColorMap = colormap({ colormap: magma, nshades: 256, format: 'rgb',alpha: 1});
  
        this.waveSurfer.enableDragSelection({});
  
        this.regions_list = this.waveSurfer.regions.list;
        //regions_list is an object...!!
  
      });
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

    firebase.storage().ref(`SPECTROGRAMS/${dateString}/${participantId}/${currentStage}.png`).getDownloadURL().then((url) => {
      this.spectrogram = url;

    }).catch((error) => {
      if (error.code === 'storage/object-not-found') {
        this.spectrogramFlag = true
      }
    })
  }

  resetForm() {
    this.formControls.volumeOkay.setValue('y');
    this.formControls.continuousAudio.setValue('y');
    this.formControls.audioQuality.setValue('clean_audio');
    this.formControls.audioCategory.setValue(this.currentStage);
    this.formControls.extraComments.setValue(null);
  }

  setupAnnotation(callback) {
    const annotateRoot = this;
    // console.log("TEST COUNT : ",this.annotatorInfo['completed_test'])
    // console.log(this.testIDs[0], this.testIDs[1])

    firebase.firestore().collection('USER_APPDATA')
      // .where('ver_test', '==', 'img_uploaded')
      .doc(this.testIDs[this.annotatorInfo['completed_test']])
      // .orderBy('p')
      // .where('dS', '<=', '2020-05-06')
      // .limit(1)
      .get().then((snapshot) => {
      // const userAppDataDoc = snapshot.docs[0]
      const userAppDataDoc = snapshot;
      // console.log(userAppDataDoc)
      console.log(userAppDataDoc.id, userAppDataDoc.data(), userAppDataDoc.ref)
      Promise.all([
        // firebase.firestore().runTransaction((transaction) => {
        //   return transaction.get(userAppDataDoc.ref).then(() => {
        //     transaction.update(userAppDataDoc.ref, {'ver_test': 'verification_in_process_v2', 'aU': annotateRoot.userData.uid})
        //   })
        // }),
        firebase.firestore().collection('ANNOTATE_APPDATA')
          .doc(this.userData.uid).collection('DATA')
          .doc(userAppDataDoc.id).set({
          // 'cS': annotateRoot.recordStages[0],
          'dS': userAppDataDoc.data()['dS'],
          'fA': false,
          'ver_test': annotateRoot.recordStages[0]
        })
      ]).then(() => {
        annotateRoot.participantId = userAppDataDoc.id;
        annotateRoot.currentStage = annotateRoot.recordStages[0];
        annotateRoot.dateString = userAppDataDoc.data()['dS'];
        annotateRoot.populateData(annotateRoot.participantId, annotateRoot.currentStage, annotateRoot.dateString);
        callback(true)
      });
    })
  // })
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
    // this.waveSurfer.drawBuffer();
    this.waveSurfer.playPause();
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
  
  imgLoaded() {
    this.enablePlayButton = true;
  }


  previousRecording() {
    this.enablePlayButton = false;
    const currentStageIndex = this.recordStages.indexOf(this.currentStage)
    this.clearRegions();
    if (currentStageIndex > 0) {
      this.stopPlaying();
      this.annotatedStageLoader = true;
      this.currentStage = this.recordStages[currentStageIndex - 1];
      this.populateData(this.participantId, this.currentStage, this.dateString);
    }
  }
}

