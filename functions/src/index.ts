import * as functions from 'firebase-functions'

import {app as lottoApp} from './lottery'
import {app as lineApp} from './line'
import {fullfillment as fullfill} from './dialogflow'
import * as line from '@line/bot-sdk'
const Client = new line.Client({channelAccessToken : '8YPInaLsR0Ihyte/TVBrOg7NPmBE8VTghj4ctBqZ4D7ovuBcFAjYpIRhbbWisppI2juj7MJSAiAkJaIDs+0QvwXFTwkHkjFbrxgPaoFgVK4NY9t5tD3zwvnkbcCk62DmWDwT68EOoyiEIVV9RL31DQdB04t89/1O/w1cDnyilFU='})



const lineApiGateWay = functions.https.onRequest(lineApp)


const lottoApi = functions.https.onRequest(lottoApp)

const fullfillment = functions.https.onRequest(fullfill)

const transHistory = functions.firestore.document('/Users/{userId}/history/{transactionId}').onCreate( (snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) =>{


    let msg : any = {
        "type": "text",
        "text": `ได้รับเงิน 5,970,000.00 บาท จาก K-HappyLotto ใช้ได้ 6,115,112.00 บาท`
      }

    Client.pushMessage('U2d493044794b863dee491bfc35596921',msg)
    .then( () =>{
        console.log("Done")
    })
    .catch(err => {
        console.error(err)
    })
    console.log(snapshot.data)
    console.log(context)
})

export {
    lottoApi,
    lineApiGateWay,
    fullfillment,
    transHistory
}
