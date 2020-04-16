import * as functions from 'firebase-functions';
const admin = require('firebase-admin');

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

let computeDailyAggregates = function(start, end, callback) {
    admin.firestore().collection('USERS')
}

export const refresh = functions.https.onRequest((request, response) => {
 // let userToken = request.query.token;
 let refreshDate = new Date(parseInt(request.query.date.toString()));
 let refreshDateISO = refreshDate.toISOString();
 let dateOnlyString = refreshDateISO.substring(0, 10)
 let previousDayDateString = new Date(refreshDate.setDate(refreshDate.getDate() - 1)).toISOString().substring(0, 10)
 let outputJSON = {
  'refreshDate': refreshDate,
  'refreshDateISO': refreshDateISO,
  'previousDayDateString': previousDayDateString,
  'date': refreshDateISO.substring(0, 10),
 }
 admin.firestore().collection('USERS')
     // .where('cS', '==', 'done')
     .where('cSD', '>=', dateOnlyString)
     .limit(10)
     .get().then((snapshot) => {
      console.log('HERE')
      console.log(snapshot.size)
      snapshot.forEach((doc) => {
       outputJSON[doc.id] = doc.data()['cSD'];
      })
   response.send(outputJSON);
 }).catch((error) => {
     console.log(error)
 })

});
