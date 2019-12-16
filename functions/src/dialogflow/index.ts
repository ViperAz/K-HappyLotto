import * as functions from 'firebase-functions'
// import * as express from 'express'
import {WebhookClient , Payload} from 'dialogflow-fulfillment'

import { firestore } from '../admin'



const grabJson = {
  "type": "bubble",
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "box",
        "layout": "horizontal",
        "contents": [
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "image",
                "url": "https://firebasestorage.googleapis.com/v0/b/k-happy-lotto.appspot.com/o/Messenger%2F71042.jpg?alt=media&token=fa4b79fd-54d0-4f35-bca1-eeb8d3206b67",
                "aspectMode": "cover",
                "size": "full"
              }
            ],
            "cornerRadius": "100px",
            "width": "72px",
            "height": "72px"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "พนักงานที่ได้รับมอบหมาย",
                "size": "sm",
                "wrap": true,
                "weight": "bold"
              },
              {
                "type": "text",
                "text": "ชื่อ : นายจริงใจ ไม่จริงจัง",
                "size": "sm",
                "wrap": true
              },
              {
                "type": "text",
                "text": "รหัสพนักงาน : 965798",
                "size": "sm",
                "wrap": true
              },
              {
                "type": "text",
                "text": "่เวลารับ : 13:45-14:00",
                "size": "sm",
                "wrap": true
              }
            ]
          }
        ],
        "spacing": "xl",
        "paddingAll": "0px"
      },
      {
        "type": "separator",
        "color": "#000000",
        "margin": "md"
      },
      {
        "type": "button",
          "action": {
            "type": "postback",
            "label": "Call",
            "data": "1"
          },
        "color": "#499640",
        "margin": "md",
        "style": "primary"
      }
    ],
    "paddingTop": "md",
    "paddingBottom": "md"
  }
}

const flexJson = {
  "type" : "flex",
  "altText": "นายจริงใจ ไม่จริงจัง กำลังมารับเงินรางวัล",
  "contents"  : grabJson
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


    console.log("requestGrab")
    let payload : Payload = new Payload(`LINE`, flexJson, { sendAsMessage: true });
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

