import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cs-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.less']
})
export class NewsComponent implements OnInit {
  newsContent = [{
    lang: 'English',
    items: [{
      paper:'Bangalore Mirror [June 14, 2021]',
      title: 'Coswara detects a change in virus',
      link: 'https://bangaloremirror.indiatimes.com/bangalore/others/coswara-detects-a-change-in-virus/articleshow/83493517.cms'
    }, {
      paper: 'ETV Bharat [June 5, 2021]',
      title: 'IISC developed COSWARA helps diagnose COVID19 through voice samples',
      link: 'https://react.etvbharat.com/english/national/bharat/iisc-developed-coswara-helps-diagnose-covid19-through-voice-samples/na20210605183801229'
    }, {
      paper: 'The New Indian Express, [June 3, 2021]',
      title: 'Sound-based diagnostic test for Covid shows 93% accuracy: IISc scientists',
      link: 'https://www.newindianexpress.com/nation/2021/jun/02/sound-based-diagnostic-test-for-covid-shows-93-accuracy-iisc-scientists-2310856.html'
    }, {
      paper: 'Bangalore Mirror [May 28, 2021]',
      title: 'Scientists now want to try Coswara tool on children',
      link: 'https://bangaloremirror.indiatimes.com/bangalore/others/scientists-now-want-to-try-coswara-tool-on-children/articleshow/83022860.cms'
    }, {
      paper: 'Bangalore Mirror [Feb 20, 2021]',
      title: 'Covid test is not a cough nut to track, finds IISc',
      link: 'https://bangaloremirror.indiatimes.com/bangalore/cover-story/covid-test-is-not-a-cough-nut-to-track-finds-iisc/articleshow/81117533.cms'
    }, {
      paper: 'Bangalore Mirror [Oct. 31, 2020]',
      title: 'IISc’s cough-covid connect shows up in MIT model too',
      link: 'https://bangaloremirror.indiatimes.com/bangalore/others/iiscs-cough-covid-connect-shows-up-in-mit-model-too/articleshow/78962337.cms'
    }, {
      paper: 'The Indian Express [Oct 2, 2020]',
      title: 'Explained: The cheaper and faster Covid-19 tests undergoing trials in India',
      link: 'https://indianexpress.com/article/explained/faster-cheaper-coronavirus-covid-19-tests-india-saliva-cough-sounds-6663609/'
    }, {
      paper: 'Financial Express [Oct 2, 2020]',
      title: 'New, simpler methods of Covid-19 testing! Trials are on; Check details',
      link: 'https://www.financialexpress.com/lifestyle/health/new-simpler-methods-of-covid-19-testing-trials-are-on-check-details/2096457/'
    }, {
      paper: 'Bangalore Mirror [June 9, 2020]',
      title: 'IISc’s sound-of-Covid study gets ICMR boost',
      link: 'https://bangaloremirror.indiatimes.com/bangalore/others/iiscs-sound-of-covid-study-gets-icmr-boost/articleshow/76271951.cms'
    }, {
      paper: 'The Dialogue [June 3, 2020]',
      title: 'Video interview',
      link: 'https://www.youtube.com/watch?v=GnBWZIt41w4'
    }, {
      paper: 'Hindustan Times [May 26, 2020]',
      title: 'IISc experts to collect sound samples of Covid patients’ cough, breath',
      link: 'https://www.hindustantimes.com/mumbai-news/iisc-experts-to-collect-sound-samples-of-covid-patients-cough-breath/story-tNqZwkX15dnfEgs9fVRPJI.html'
    }, {
      paper: 'New Indian Express [May 25, 2020]',
      title: 'Can cough sound help COVID-19 diagnosis? Yes, says IISc, Bengaluru scientists',
      link: 'https://www.newindianexpress.com/nation/2020/may/25/can-cough-sound-help-covid-19-diagnosis-yes-says-iisc-bengaluru-scientists-2147589.html'
    }, {
      paper: 'New Indian Express [May 22, 2020]',
      title: 'Now, a sound test to hear a positive pitch',
      link: 'https://www.newindianexpress.com/states/karnataka/2020/may/22/now-a-sound-test-to-hear-a-positive-pitch-2146440.html'
    }, {
      paper: 'Bangalore Mirror [May 4, 2020]',
      title: 'What does an infection sound like? IISc',
      link: 'https://bangaloremirror.indiatimes.com/bangalore/others/what-does-an-infection-sound-like-iisc-knows/articleshow/75524950.cms'
    }, {
      paper: 'The Better India [Apr 30, 2020]',
      title: 'Here’s your chance to help the scientists. All you need is a smartphone, an inbuilt microphone and 5 minutes of your time! #COVID19',
      link: 'https://www.thebetterindia.com/225136/bengaluru-iisc-innovation-coronavirus-test-coswara-covid19-india-tan42/'
    }, {
      paper: 'Telegraph India [Apr 26, 2020]',
      title: 'Institutions take the innovation route to aid Covid-19 fight',
      link: 'https://www.telegraphindia.com/india/institutions-take-the-innovation-route-to-aid-covid-19-fight/cid/1768245'
    }, {
      paper: 'IndiaToday [Apr 17, 2020]',
      title: 'IISc researchers working on tool for Covid-19 diagnosis based on cough, speech sounds',
      link: 'https://www.indiatoday.in/education-today/news/story/coronavirus-in-india-iisc-researchers-working-on-tool-for-covid-19-diagnosis-based-on-cough-speech-sounds-1667809-2020-04-17'
    }, {
      paper: 'OneIndia [Apr 16, 2020]',
      title: 'Tool to diagnose COVID-19 based on cough, speech being worked on',
      link: 'https://www.oneindia.com/india/tool-to-diagnose-covid-19-based-on-cough-speech-being-worked-on-3072438.html'
    }, {
      paper: 'Express Computer [Apr 16, 2020]',
      title: 'IISc researchers working on tool that diagnoses Covid-19 based on cough, speech',
      link: 'https://www.expresscomputer.in/news/iisc-researchers-working-on-tool-that-diagnoses-covid-19-based-on-cough-speech/53231/'
    }, {
      paper: 'Economic Times [Apr 15, 2020]',
      title: 'IISc researchers working on tool for COVID-19 diagnosis based on cough, speech sounds',
      link: 'https://economictimes.indiatimes.com/news/science/iisc-researchers-working-on-tool-for-covid-19-diagnosis-based-on-cough-speech-sounds/articleshow/75155090.cms'
    }, {
      paper: 'Deccan Chronicle [Apr 15, 2020]',
      title: 'IISc working on tool for COVID-19 detection based on cough, speech sounds',
      link: 'https://www.deccanchronicle.com/technology/in-other-news/150420/iisc-working-on-tool-for-covid-19-detection-based-on-cough-speech-sou.html'
    },  {
      paper: 'Outlook India [Apr 15, 2020]',
      title: 'IISc researchers working on tool for COVID-19 diagnosis based on cough, speech sounds',
      link: 'https://www.outlookindia.com/newsscroll/iisc-researchers-working-on-tool-for-covid19-diagnosis-based-on-cough-speech-sounds/1802846'
    }, {
      paper: 'OdishaBytes [Apr 15, 2020]',
      title: 'Cough & Speech Sounds For COVID-19 Diagnosis? Find Out What Researchers Are Doing',
      link: 'https://odishabytes.com/cough-speech-sounds-for-covid-19-diagnosis-find-out-what-researchers-are-doing/'
    }, {
      paper: 'Edex Live [Apr 15, 2020]',
      title: 'IISc researchers are working on a tool for COVID-19 diagnosis based on cough and speech sounds',
      link: 'https://www.edexlive.com/news/2020/apr/15/iisc-researchers-are-working-on-a-tool-for-covid-19-diagnosis-based-on-cough-and-speech-sounds-11316.html'
    }, {
      paper: 'The Asian Age [Apr 15, 2020]',
      title: 'IISc developing tool to detect COVID-19 based sound of an infected person\'s cough, speech',
      link: 'https://www.asianage.com/technology/in-other-news/150420/iisc-developing-tool-to-detect-covid-19-based-sound-of-an-infected-persons-cough-speech.html'
    }, {
      paper: 'Mashable India [Apr 2020]',
      title: 'This New Tool Might Be Able To Diagnose COVID-19 Based On Cough, Speech Sounds',
      link: 'https://in.mashable.com/tech/13215/this-new-tool-might-be-able-to-diagnose-covid-19-based-on-cough-speech-sounds'
    }]
  }, {
    lang: 'Hindi',
    items: [{
      paper: 'Amar Ujala [Apr 16, 2020]',
      title: 'सांस की तरंगों और खांसी की आवाज सुनकर कोरोना के इलाज में मदद करेगा यह खास उपकरण',
      link: 'https://www.amarujala.com/photo-gallery/lifestyle/fitness/scientist-develop-a-machine-for-coronavirus-test-by-sound-of-caugh-and-breath-wave?pageId=2'
    }, {
      paper: 'Jagran [Apr 15, 2020]',
      title: 'खांसी, श्‍वसन ध्वनियों के आधार पर कोरोना की पहचान के लिए डिवाइस बनाने में जुटे वैज्ञानिक',
      link: 'https://www.jagran.com/news/national-iisc-researchers-working-on-tool-for-coronavirus-diagnosis-based-on-cough-sounds-20192503.html'
    }, {
      paper: 'India Times [Apr 15, 2020]',
      title: 'शोधकर्ता खांसी, श्वसन ध्वनियों के आधार पर कोरोना वायरस के निदान पर कर रहे है काम',
      link: 'https://navbharattimes.indiatimes.com/india/researchers-are-working-on-diagnosis-of-corona-virus-based-on-cough-respiratory-sounds/articleshow/75155921.cms'
    }, {
      paper: 'Prabhat Khabar [Apr 15, 2020]',
      title: 'अगर कामयाब हुआ यह रिसर्च, तो कोरोना वायरस को हराना हो जाएगा आसान',
      link: 'https://www.prabhatkhabar.com/national/indian-institute-of-science-researchers-is-working-on-a-tool-to-diagnose-corona-virus-based-on-respiratory-cough-and-sound-waves'
    }, {
      paper: 'Samay Live [Apr 15, 2020]',
      title: 'शोधकर्ता खांसी, श्वसन ध्वनियों के आधार पर कोरोना वायरस के निदान पर कर रहे काम',
      link: 'http://www.samaylive.com/nation-news-in-hindi/417077/researchers-working-on-tool-for-coronavirus-diagnosis-based-on-cough-speech-sounds.html'
    }, {
      paper: 'Asianet News [Apr 15, 2020]',
      title: 'सांस लेने और खांसी की आवाज से हो सकेगी कोरोना की टेस्टिंग, भारत में हो रही है रिसर्च',
      link: 'https://hindi.asianetnews.com/national-news/iisc-researchers-working-on-tool-for-covid-19-diagnosis-kpn-q8u1y5'
    }]
  }, {
    lang: 'Tamil',
    items: [{
      paper: 'Hindu Tamil [May 4, 2020]',
      title: 'குரல் மூலம் கரோனாவைக் கண்டுபிடிக்கப் புதிய கருவி!',
      link: 'https://www.hindutamil.in/news/india/552737-corona-device.html'
    }]
  }, {
    lang: 'French',
    items: [{
      paper: 'FZN [Apr 18, 2020]',
      title: 'COSWARA, BIENTÔT UN NOUVEL INSTRUMENT POUR DÉTECTER LE COVID-19 ?',
      link: 'https://www.fredzone.org/coswara-bientot-un-nouvel-instrument-pour-detecter-le-covid-19-655'
    }]
  }, {
    lang: 'Spanish',
    items: [{
      paper: 'es de latino [Apr 15, 2020]',
      title: 'Investigadores del IISc trabajando en una herramienta para el diagnóstico de COVID-19 basada en tos, sonidos del habla',
      link: 'https://www.esdelatino.com/investigadores-del-iisc-trabajando-en-una-herramienta-para-el-diagnostico-de-covid-19-basada-en-tos-sonidos-del-habla/'
    }]
  }]

  constructor() { }

  ngOnInit() {
  }

}
