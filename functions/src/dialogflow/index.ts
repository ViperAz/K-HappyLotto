import * as functions from 'firebase-functions'
// import * as express from 'express'
import {WebhookClient , Payload} from 'dialogflow-fulfillment'

import { firestore } from '../admin'



const grabJson = {
    "type": "template",
    "altText": "this is a buttons template",
    "template": {
      "type": "buttons",
      "actions": [
        {
          "type": "postback",
          "label": "Call",
          "data": "callMode"
        }
      ],
      "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/k-happy-lotto.appspot.com/o/Messenger/965735.jpg?alt=media&token=2b73f1e2-266b-4fa8-adaa-9988ebb36071",
      "title": "เรากำลังไปให้รางวัลของคุณ",
      "text": "นาย จริงจัง แต่ไม่จริงใจ"
    }
  }

const fullfillment  = (req : functions.https.Request , res : functions.Response)  => {
    console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers))
    console.log('Dialogflow Request body: ' + JSON.stringify(req.body))
    const agent : WebhookClient = new WebhookClient( {request : req ,response : res})

    // console.log("1")
    const lottoChecker = (agent : WebhookClient) => {
        firestore.collection("Lotto").doc("20191216").get()
        .then( doc =>{
            console.log(doc.data())          
        } )
        console.log("5555")
        agent.add("ดีจ้า")
    }


    const requestGrab = (agent : WebhookClient) => {


        
        let payload : Payload = new Payload(`LINE`, grabJson, { sendAsMessage: true });

        agent.add(payload)
    }

    

    let intentMap = new Map()
    intentMap.set('ตรวจหวยประจำงวด',lottoChecker)
    intentMap.set('request grab',requestGrab)


    agent.handleRequest(intentMap)

}



export {
    fullfillment
}

