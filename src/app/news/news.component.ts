import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cs-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.less']
})
export class NewsComponent implements OnInit {
  newsContent = [{
    lang: 'English (Major)',
    items: [{
      paper: 'The Better India',
      title: 'Here’s your chance to help the scientists. All you need is a smartphone, an inbuilt microphone and 5 minutes of your time! #COVID19',
      link: 'https://www.thebetterindia.com/225136/bengaluru-iisc-innovation-coronavirus-test-coswara-covid19-india-tan42/'
    }, {
      paper: 'IndiaToday',
      title: 'IISc researchers working on tool for Covid-19 diagnosis based on cough, speech sounds',
      link: 'https://www.indiatoday.in/education-today/news/story/coronavirus-in-india-iisc-researchers-working-on-tool-for-covid-19-diagnosis-based-on-cough-speech-sounds-1667809-2020-04-17'
    }, {
      paper: 'Economic Times',
      title: 'IISc researchers working on tool for COVID-19 diagnosis based on cough, speech sounds',
      link: 'https://economictimes.indiatimes.com/news/science/iisc-researchers-working-on-tool-for-covid-19-diagnosis-based-on-cough-speech-sounds/articleshow/75155090.cms'
    }, {
      paper: 'Deccan Chronicle',
      title: 'IISc working on tool for COVID-19 detection based on cough, speech sounds',
      link: 'https://www.deccanchronicle.com/technology/in-other-news/150420/iisc-working-on-tool-for-covid-19-detection-based-on-cough-speech-sou.html'
    }]
  }, {
    lang: 'English (Minor)',
    items: [{
      paper: 'OneIndia',
      title: 'Tool to diagnose COVID-19 based on cough, speech being worked on',
      link: 'https://www.oneindia.com/india/tool-to-diagnose-covid-19-based-on-cough-speech-being-worked-on-3072438.html'
    }, {
      paper: 'Outlook India',
      title: 'IISc researchers working on tool for COVID-19 diagnosis based on cough, speech sounds',
      link: 'https://www.outlookindia.com/newsscroll/iisc-researchers-working-on-tool-for-covid19-diagnosis-based-on-cough-speech-sounds/1802846'
    }, {
      paper: 'OdishaBytes',
      title: 'Cough & Speech Sounds For COVID-19 Diagnosis? Find Out What Researchers Are Doing',
      link: 'https://odishabytes.com/cough-speech-sounds-for-covid-19-diagnosis-find-out-what-researchers-are-doing/'
    }, {
      paper: 'Edex Live',
      title: 'IISc researchers are working on a tool for COVID-19 diagnosis based on cough and speech sounds',
      link: 'https://www.edexlive.com/news/2020/apr/15/iisc-researchers-are-working-on-a-tool-for-covid-19-diagnosis-based-on-cough-and-speech-sounds-11316.html'
    }, {
      paper: 'The Asian Age',
      title: 'IISc developing tool to detect COVID-19 based sound of an infected person\'s cough, speech',
      link: 'https://www.asianage.com/technology/in-other-news/150420/iisc-developing-tool-to-detect-covid-19-based-sound-of-an-infected-persons-cough-speech.html'
    }, {
      paper: 'Mashable India',
      title: 'This New Tool Might Be Able To Diagnose COVID-19 Based On Cough, Speech Sounds',
      link: 'https://in.mashable.com/tech/13215/this-new-tool-might-be-able-to-diagnose-covid-19-based-on-cough-speech-sounds'
    }, {
      paper: 'Express Computer',
      title: 'IISc researchers working on tool that diagnoses Covid-19 based on cough, speech',
      link: 'https://www.expresscomputer.in/news/iisc-researchers-working-on-tool-that-diagnoses-covid-19-based-on-cough-speech/53231/'
    }, {
      paper: 'Telegraph India',
      title: 'Institutions take the innovation route to aid Covid-19 fight',
      link: 'https://www.telegraphindia.com/india/institutions-take-the-innovation-route-to-aid-covid-19-fight/cid/1768245'
    }]
  }, {
    lang: 'Hindi',
    items: [{
      paper: 'Jagran',
      title: 'खांसी, श्‍वसन ध्वनियों के आधार पर कोरोना की पहचान के लिए डिवाइस बनाने में जुटे वैज्ञानिक',
      link: 'https://www.jagran.com/news/national-iisc-researchers-working-on-tool-for-coronavirus-diagnosis-based-on-cough-sounds-20192503.html'
    }, {
      paper: 'India Times',
      title: 'शोधकर्ता खांसी, श्वसन ध्वनियों के आधार पर कोरोना वायरस के निदान पर कर रहे है काम',
      link: 'https://navbharattimes.indiatimes.com/india/researchers-are-working-on-diagnosis-of-corona-virus-based-on-cough-respiratory-sounds/articleshow/75155921.cms'
    }, {
      paper: 'Amar Ujala',
      title: 'सांस की तरंगों और खांसी की आवाज सुनकर कोरोना के इलाज में मदद करेगा यह खास उपकरण',
      link: 'https://www.amarujala.com/photo-gallery/lifestyle/fitness/scientist-develop-a-machine-for-coronavirus-test-by-sound-of-caugh-and-breath-wave?pageId=2'
    }, {
      paper: 'Prabhat Khabar',
      title: 'अगर कामयाब हुआ यह रिसर्च, तो कोरोना वायरस को हराना हो जाएगा आसान',
      link: 'https://www.prabhatkhabar.com/national/indian-institute-of-science-researchers-is-working-on-a-tool-to-diagnose-corona-virus-based-on-respiratory-cough-and-sound-waves'
    }, {
      paper: 'Samay Live',
      title: 'शोधकर्ता खांसी, श्वसन ध्वनियों के आधार पर कोरोना वायरस के निदान पर कर रहे काम',
      link: 'http://www.samaylive.com/nation-news-in-hindi/417077/researchers-working-on-tool-for-coronavirus-diagnosis-based-on-cough-speech-sounds.html'
    }, {
      paper: 'Asianet News',
      title: 'सांस लेने और खांसी की आवाज से हो सकेगी कोरोना की टेस्टिंग, भारत में हो रही है रिसर्च',
      link: 'https://hindi.asianetnews.com/national-news/iisc-researchers-working-on-tool-for-covid-19-diagnosis-kpn-q8u1y5'
    }]
  }, {
    lang: 'French',
    items: [{
      paper: 'FZN',
      title: 'COSWARA, BIENTÔT UN NOUVEL INSTRUMENT POUR DÉTECTER LE COVID-19 ?',
      link: 'https://www.fredzone.org/coswara-bientot-un-nouvel-instrument-pour-detecter-le-covid-19-655'
    }]
  }, {
    lang: 'Spanish',
    items: [{
      paper: 'es de latino',
      title: 'Investigadores del IISc trabajando en una herramienta para el diagnóstico de COVID-19 basada en tos, sonidos del habla',
      link: 'https://www.esdelatino.com/investigadores-del-iisc-trabajando-en-una-herramienta-para-el-diagnostico-de-covid-19-basada-en-tos-sonidos-del-habla/'
    }]
  }]

  constructor() { }

  ngOnInit() {
  }

}
