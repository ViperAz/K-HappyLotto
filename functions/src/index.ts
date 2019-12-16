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


    const userId = context.params.userId
    let data : any = snapshot.data()

    console.log(userId)
    console.log(data)
    console.log(context)
    let msg : any = {
        "type": "text",
        "text": `ได้รับเงิน ${data.money} บาท จาก K-HappyLotto`
      }

    Client.pushMessage(userId,msg)
    .then( () =>{
        console.log("Done")
    })
    .catch(err => {
        console.error(err)
    })

})

export {
    lottoApi,
    lineApiGateWay,
    fullfillment,
    transHistory
}
