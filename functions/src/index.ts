import * as admin from "firebase-admin";
import * as functions from 'firebase-functions';

const adminApp = admin.initializeApp()
const dateSummaryTemplate: { [id: string] : number; } = {
    "visited": 0,
    "completed": 0,
    "positive_mild": 0,
    "positive_moderate": 0,
    "recovered_full": 0,
    "resp_illness_not_identified": 0,
    "no_resp_illness_exposed": 0,
    "healthy": 0,
    "web_users": 0,
    "android_users": 0,
    "ios_users": 0,
    "gender_male": 0,
    "gender_female": 0,
    "gender_other": 0
}

const getDateStringWithOffset = function(dateString: string, offset: number) {
    const dateStringISO = `${dateString}T00:00:00.000Z`
    const dataObject = new Date(dateStringISO)
    dataObject.setDate(dataObject.getDate() + offset)
    return dataObject.toISOString().substring(0, 10)
}

exports.metaDataNewDateAdded = functions.firestore.document('USER_METADATA/{dateString}').onCreate((snapshot => {
    const dateString = snapshot.ref.path.split('/')[1];
    const prevDateString = getDateStringWithOffset(dateString, -1)
    const statsDateString = getDateStringWithOffset(dateString, -2)
    const db = adminApp.firestore();
    return Promise.all([
        db.collection('COLLECT_STATS').doc(statsDateString).get(),
        db.collection('USER_METADATA').doc(prevDateString).get(),
        db.collection('COLLECT_STATS').doc(statsDateString).collection('STATS').doc('l_c').get(),
        db.collection('USER_METADATA').doc(statsDateString).collection('STATS').doc('l_c').get()
    ]).then((result) => {
        const dateSummary = Object.assign({}, dateSummaryTemplate);
        const prevStatsData = result[0].data() || Object.assign({}, dateSummaryTemplate);
        const dateData = result[1].data() || Object.assign({}, dateSummaryTemplate);
        Object.keys(dateSummary).forEach((key) => {
            dateSummary[key] = (prevStatsData[key] ? prevStatsData[key] : 0) + (dateData[key] ? dateData[key] : 0)
        })

        const netCountryStatsData = {}
        const prevCountryStatsData = result[2].data() || {}
        const dateCountryStatsData = result[3].data() || {}
        Object.keys({...prevCountryStatsData, ...dateCountryStatsData}).forEach((key) => {
            netCountryStatsData[key] = (prevCountryStatsData[key] ? prevCountryStatsData[key] : 0) + (dateCountryStatsData[key] ? dateCountryStatsData[key] : 0)
        })
        const batch = db.batch();
        batch.set(
            db.collection('COLLECT_STATS').doc(prevDateString),
            dateSummary
        );
        batch.set(
            db.collection('COLLECT_STATS').doc(prevDateString).collection('STATS').doc('l_c'),
            netCountryStatsData
        )
        batch.commit().then(() => {
                console.log(`UPDATED STATS FOR ${prevDateString}`)
                return true;
        }).catch((error) => {
            console.log('COLLECT_STATS', error)
            return Promise.reject(error)
        });
    }).catch((error) => {
        console.error('TRANSACTION RUN', error)
        return Promise.reject(error)
    });
}))

exports.metaDataNewUserAdded = functions.firestore.document('USER_METADATA/{dateString}/DATA/{userId}').onCreate((snapshot, context) => {
    const userMetaData = snapshot.data();
    const dateString = context.params.dateString;
    console.log('NEW USER =>', context.params.userId ,'AT  =>', dateString)
    const db = adminApp.firestore();
    const metaDataJSON = admin.storage().bucket().file(`COLLECT_DATA/${dateString}/${context.params.userId}/metadata.json`);
    const changeRef = db.collection('USER_METADATA').doc(dateString)
    const jsonBuffer = new Buffer(JSON.stringify(userMetaData, null, 4), 'utf8');
    return Promise.all([
        metaDataJSON.save(jsonBuffer, { metadata: {type: "application/json"}}),
        db.runTransaction((transaction) => {
            return transaction.get(changeRef).then((doc) => {
                const dateSummary = doc.data() || Object.assign({}, dateSummaryTemplate);
                console.log('CURRENT DATE SUMMARY => ', dateSummary)
                dateSummary.visited = dateSummary.visited + 1
                console.log('UPDATED DATE SUMMARY => ', dateSummary)
                if (doc.exists) {
                    return transaction.update(changeRef, {'visited': dateSummary.visited});
                } else {
                    return transaction.set(changeRef, dateSummary);
                }
            }).catch(error => {
             console.error('TRANSACTION GET', error)
             return Promise.reject(error)
            })
        })]).then(() => {
        console.log('TRANSACTION SUCCESS')
        return true;
    }).catch((error) => {
        console.error('TRANSACTION RUN', error)
        return Promise.reject(error)
    });
})

exports.metaDataNewUserUpdated = functions.firestore.document('USER_METADATA/{dateString}/DATA/{userId}').onUpdate((snapshot, context) => {
    const userMetaData = snapshot.after.data();
    const dateString = context.params.dateString;
    const db = adminApp.firestore();
    const changeRef = db.collection('USER_METADATA').doc(dateString)
    if (userMetaData && userMetaData['iF']) {
        console.log('USER UPDATE =>', context.params.userId, 'AT =>', dateString)
        return db.runTransaction((transaction) => {
            return transaction.get(changeRef).then((doc) => {
                const dateSummary = doc.data() || Object.assign({}, dateSummaryTemplate);
                console.log('CURRENT DATE SUMMARY => ', dateSummary)
                dateSummary.completed = dateSummary.completed + 1
                dateSummary[`${userMetaData['dT']}_users`] =  dateSummary[`${userMetaData['dT']}_users`] + 1
                dateSummary[`gender_${userMetaData['g']}`] = dateSummary[`gender_${userMetaData['g']}`] + 1
                dateSummary[userMetaData['covid_status']] = dateSummary[userMetaData['covid_status']] + 1
                console.log('UPDATED DATE SUMMARY => ', dateSummary)
                return transaction.update(changeRef, dateSummary);
            }).catch(error => {
                console.error('TRANSACTION GET', error)
                return Promise.reject(error)
            })
        }).then(() => {
            console.log('TRANSACTION SUCCESS')
            return true;
        }).catch((error) => {
            console.error('TRANSACTION RUN', error)
            return Promise.reject(error)
        });
    } else {
        console.error('USER NOT COMPLETED')
        return Promise.reject('USER NOT COMPLETED')
    }
})
