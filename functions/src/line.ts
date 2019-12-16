import * as line from '@line/bot-sdk'
import  * as express from 'express'
import * as requestPromise from "request-promise"
import { Readable } from 'stream';
import cors = require('cors');

import {lottoWinner} from './card/lottoWinner'
// import * as admin from 'firebase-admin';

// const fireStore : FirebaseFirestore.Firestore = admin.firestore()


const Client = new line.Client({channelAccessToken : '8YPInaLsR0Ihyte/TVBrOg7NPmBE8VTghj4ctBqZ4D7ovuBcFAjYpIRhbbWisppI2juj7MJSAiAkJaIDs+0QvwXFTwkHkjFbrxgPaoFgVK4NY9t5tD3zwvnkbcCk62DmWDwT68EOoyiEIVV9RL31DQdB04t89/1O/w1cDnyilFU='})

const app = express()
app.use(cors({origin : true}))
app.post('*', (req : express.Request,res : express.Response) =>{
    
    let event : line.MessageEvent = req.body.events[0]
    let replyToken : string = event.replyToken
    if (event.type === "message" ) {
        if (event.message.type === "text"){
            /**
            * Text section
            *   Send to dialogflow to handle text request 
            *   
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
             * 1. Validate images that recieved are lottery via API ... 
             * 2. if they are lotteries receive number and date
             * 3. upload both images and raw number and date to database 
             * 4. validate lotto if result exist
             * 5. send msg the result
             * Dont do promise Hell like me lmao
             */

            getImageContent(event.message.id)
            .then((stream : Readable) =>{
                let data: Buffer[] = []
                stream.on("data",(chunk : Buffer)=>{
                    // console.log(chunk)
                    data.push(chunk)
                })

                stream.on("end",()=>{
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
                    .then( (result : string) =>{


                        let rst = JSON.parse(result)
                        let lotto = {
                            number : rst[0]["number"],
                            round : rst[0]["round"],
                            set : rst[0]["set"],
                            lottoDate : rst[0]["lottoDate"]
                        }

                        requestPromise.post({
                            uri : 'https://us-central1-k-happy-lotto.cloudfunctions.net/checkPrize' ,
                            headers :  {
                                'Content-Type' : 'application/json',
                            },
                            body : {
                                "number": lotto.number,
                                "round": lotto.round
                            },
                            json : true
                        })
                        .then( (resultLotto  : string[]) => {
                            // lottoNumber = lotto.number
                            // lottoPrize = resultLotto[0]
                            // lottoeryDate = lotto.lottoDate
                            let flexJson : any = new lottoWinner(lotto.number,lotto.round,resultLotto[0],lotto.lottoDate).getLottoJson()
                            console.log(flexJson)
                            Client.replyMessage(replyToken,flexJson)
                            .then( () =>{
                                console.log("Hello ?")
                                res.status(200).end()
                            })
                            .catch (err =>{
                                res.send(err).status(500).end()
                            })
                            // console.log(resultLotto[0])
                            // res.status(200).end()
                        })          
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
            console.log (JSON.stringify(req.body))
            reply(req)
            .then( () => {
                res.status(200).end()
            })
            .catch( err => {
                res.send(err).status(500).end()
            })
        }

      }
    else if (event.type === "postback"){
        
        let pbEvent  : line.PostbackEvent = req.body.events[0]
        let amount = "0"
        if (pbEvent.postback.data === "1"){
            amount = "100"
        }
        if(pbEvent.postback.data === "รางวัลที่ 1"){
            amount = "5970000"
        } 
        if (pbEvent.postback.data === "รางวัลที่ 2") {
            amount = "200000"
        } 
        if (pbEvent.postback.data === "รางวัลที่ 3") {
            amount = "80000"
        } 
        if (pbEvent.postback.data === "รางวัลที่ 4") {
            amount = "40000"
        } 
        if (pbEvent.postback.data === "รางวัลที่ 5") {
            amount = "20000"
        } 
        if (pbEvent.postback.data === "รางวัลเลขหน้า 3 ตัว") {
            amount = "4000"
        } 
        if (pbEvent.postback.data === "รางวัลเลขท้าย 3 ตัว") {
            amount = "4000"
        } 
        if (pbEvent.postback.data === "รางวัลเลขท้าย 2 ตัว") {
            amount = "2000"
        }
        console.log(amount)

        requestPromise.post({
            uri : 'https://us-central1-k-happy-lotto.cloudfunctions.net/transfer' ,
            headers :  {
                'Content-Type' : 'application/json',
            },
            body : {
                "amount" : amount
            },
            json : true
        })
        .then (result => {
            console.log("yay")
            res.status(200).end()
        })
        .catch (err  =>{
            console.log(err)
            res.status(500).end()
        })

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


export {
    app
}