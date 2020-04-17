import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

admin.initializeApp();

exports.userMetaDataAdded = functions.firestore.document('USER_METADATA/{dateString}/DATA/{userId}').onCreate((snapshot => {
    const userMetaData = snapshot.data();

}))

