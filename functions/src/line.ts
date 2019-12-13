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
            /**
            * Text section
            *   Send to dialogflow to handle text request 
            *   (WIP)
            */
            sendToDialogflow(req)
            .then( () => {
                res.status(200).end()
            })
            .catch( err => {
                res.send(err).status(500).end()
            })
        }
        else if (event.message.type === "image"){

            /**
             * Image receive section
             * 
             * 1. Validate images that recieved are lottery via API ... (WIP)
             * 2. if they are lotteries receive number and date
             * 3. upload both images and raw number and date to database 
             */

            getImageContent(event.message.id)
            .then((stream : Readable) =>{
                let data: Buffer[] = []
                stream.on("data",(chunk : Buffer)=>{
                    // console.log(chunk)
                    data.push(chunk)
                })

                stream.on("end",()=>{
                    // console.log(data)
                    console.log(data)
                    requestPromise.post({
                        uri: "https://us-central1-k-happy-lotto.cloudfunctions.net/scanLotto",
                        headers :  {
                            'Accept-Encoding' : 'gzip, deflate',
                            'Content-Type' : 'image/jpeg',
                            'Connection' : 'keep-alive',
                            'Cache-Control' : 'no-cache'
                        },
                        body: Buffer.concat(data)
                    })
                    .then( (result : object[]) =>{
                        console.log(result[0].)
                        res.status(200).end()
                    })
                    .catch( err => {
                        console.error(err)
                        res.status(err.statusCode).end()
                    })
                    
                })

                
            })
            .catch( err =>{
                console.error(err)
                res.send(err).status(500).end()
            })
            // Client.replyMessage(req.body.events[0].replyToken,{type : "text", text : imageBinary})
        }

        else {
            /**
             * Unhandle request type of message 
             */
            
            reply(req)
            .then( () => {
                res.status(200).end()
            })
            .catch( err => {
                res.send(err).status(500).end()
            })
        }

      }

    //   res.status(404).end()


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


const imageHandler = async (req : express.Request) => {
    let event : line.WebhookEvent = req.body.events[0]

    Client.getMessageContent(event.message.id)
}

export {
    app
}