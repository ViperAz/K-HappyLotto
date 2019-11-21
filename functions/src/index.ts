import * as functions from 'firebase-functions'
import * as line from '@line/bot-sdk'
import  * as express from 'express'
import * as requestPromise from "request-promise"
import { Readable } from 'stream';
import cors = require('cors');

const Client = new line.Client({channelAccessToken : '8YPInaLsR0Ihyte/TVBrOg7NPmBE8VTghj4ctBqZ4D7ovuBcFAjYpIRhbbWisppI2juj7MJSAiAkJaIDs+0QvwXFTwkHkjFbrxgPaoFgVK4NY9t5tD3zwvnkbcCk62DmWDwT68EOoyiEIVV9RL31DQdB04t89/1O/w1cDnyilFU='})

const app = express()

app.use(cors({origin : true}))

app.post('*', (req : express.Request,res : express.Response) =>{
    let event : line.WebhookEvent = req.body.events[0]
    if (event.type === "message" ) {
        if (event.message.type === "text"){
            //call dialogflow request
            sendToDialogflow(req)
            .then( () => {
                res.status(200).end()
            })
            .catch( err => {
                res.send(err).status(500).end()
            })
        }
        else if (event.message.type === "image"){

            getImageContent(event.message.id)
            .then((stream : Readable) =>{
                let data : string = ""
                stream.on("data",(chunk)=>{
                    console.log(chunk)
                    data += chunk
                })

                stream.on("end",()=>{
                    console.log(data)
                })

                
            })
            .catch( err =>{
                console.error(err)
                res.send(err).status(500).end()
            })
            // Client.replyMessage(req.body.events[0].replyToken,{type : "text", text : imageBinary})
        }

      } else {
        //Handle Image etc.. cases
        reply(req)
        .then( () => {
            res.status(200).end()
        })
        .catch( err => {
            res.send(err).status(500).end()
        })
      }
})


const getImageContent = (contentId : string) => {
    return Client.getMessageContent(contentId)
}


const sendToDialogflow = (req : express.Request) => {
req.headers.host = "bots.dialogflow.com";
return requestPromise.post({
    uri: "https://bots.dialogflow.com/line/2d24edaf-4931-42d0-acfd-a07621b67a93/webhook",
    headers: req.headers,
    body: JSON.stringify(req.body)
})
}

const reply = (req : express.Request) => {
    return Client.replyMessage(req.body.events[0].replyToken,{type : "text", text : JSON.stringify(req.body)});
}

exports.lineApiGateWay = functions.https.onRequest(app)
