// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

export const firebaseConfig = {
  apiKey: "AIzaSyA8kL8N18moJvVvVmwmhRlBstWACLFi1yc",
  authDomain: "covid-speech.firebaseapp.com",
  databaseURL: "https://covid-speech.firebaseio.com",
  projectId: "covid-speech",
  storageBucket: "covid-speech.appspot.com",
  messagingSenderId: "909223225214",
  appId: "1:909223225214:web:4aa1e70796b412cbf8752f",
  measurementId: "G-0PLRFNHLH0"
};

export const values = {
  age_groups: [{
    id: 0,
    value: '0-10'
  }, {
    id: 1,
    value: '10-20'
  }, {
    id: 2,
    value: '20-30'
  }, {
    id: 3,
    value: '30-40'
  }, {
    id: 4,
    value: '40-50'
  }, {
    id: 5,
    value: '50-60'
  }, {
    id: 6,
    value: '60-70'
  }, {
    id: 7,
    value: '70-80'
  }, {
    id: 8,
    value: '80+'
  }],
  gender: [{
    id: 0,
    value: 'Male'
  }, {
    id: 1,
    value: 'Female'
  }, {
    id: 2,
    value: 'Others'
  }],
  'health_status': [{
    id: 'positive_mild',
    value: 'I have been identified with Covid-19 and have mild symptoms'
  }, {
    id: 'positive_moderate',
    value: 'I have been identified with Covid-19 and have moderately severe symptoms'
  }, {
    id: 'recovered_full',
    value: 'I was identified with Covid-19 and have recovered fully'
  }, {
    id: 'resp_illness_not_identified',
    value: 'I have other pre-existing respiratory illnesses but have not been identified with Covid-19'
  }, {
    id: 'no_resp_illness_exposed',
    value: 'I have no respiratory illness but I may have been exposed to the virus through contact'
  }, {
    id: 'no_resp_illness',
    value: 'I do not have any respiratory illnesses'
  }],
  illness: {
    resp: [{
      id: 'smoker',
      name: 'Smoker'
    }, {
      id: 'asthma',
      name: 'Asthma'
    }, {
      id: 'chronic_ling_disease',
      name: 'Chronic lung disease'
    }],
    heart: [{
      id: 'hypertension',
      name: 'Hypertension'
    }, {
      id: 'ihd',
      name: 'Ischemic heart disease'
    }],
    others: [{
      id: 'diabetes',
      name: 'Diabetes'
    }, {
      id: 'allergies',
      name: 'Allergies'
    }, {
      id: 'ckd',
      name: 'Chronic kidney disease'
    }]
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
