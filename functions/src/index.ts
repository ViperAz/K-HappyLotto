import * as functions from 'firebase-functions'

import {app as lottoApp} from './lottery'
import {app as lineApp} from './line'
import {fullfillment as fullfill} from './dialogflow'




const lineApiGateWay = functions.https.onRequest(lineApp)


const lottoApi = functions.https.onRequest(lottoApp)

const fullfillment = functions.https.onRequest(fullfill)

const transHistory = functions.firestore.document('/Users/{userId}/history/{transactionId}').onCreate( (snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) =>{
    console.log(snapshot.data)
    console.log(context)
})

export {
    lottoApi,
    lineApiGateWay,
    fullfillment,
    transHistory
}
