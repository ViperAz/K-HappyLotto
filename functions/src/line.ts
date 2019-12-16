import * as line from '@line/bot-sdk'
import  * as express from 'express'
import * as requestPromise from "request-promise"
import { Readable } from 'stream';
import cors = require('cors');

import {lottoWinner , lottoLoser,textMessage} from './card'
// import * as admin from 'firebase-admin';

// const fireStore : FirebaseFirestore.Firestore = admin.firestore()


const Client = new line.Client({channelAccessToken : '8YPInaLsR0Ihyte/TVBrOg7NPmBE8VTghj4ctBqZ4D7ovuBcFAjYpIRhbbWisppI2juj7MJSAiAkJaIDs+0QvwXFTwkHkjFbrxgPaoFgVK4NY9t5tD3zwvnkbcCk62DmWDwT68EOoyiEIVV9RL31DQdB04t89/1O/w1cDnyilFU='})

const app = express()
app.use(cors({origin : true}))
app.post('*', (req : express.Request,res : express.Response) =>{
    
    let event : line.MessageEvent = req.body.events[0]
    // let replyToken : string = event.replyToken
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
            imageProcess(req)
            .then ( () => {
                res.status(200).end()
            })
            .catch( err =>{
                res.status(500).send(err).end()
            })
        
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
            amount = "5970"
        } 
        if (pbEvent.postback.data === "รางวัลที่ 2") {
            amount = "2000"
        } 
        if (pbEvent.postback.data === "รางวัลที่ 3") {
            amount = "800"
        } 
        if (pbEvent.postback.data === "รางวัลที่ 4") {
            amount = "400"
        } 
        if (pbEvent.postback.data === "รางวัลที่ 5") {
            amount = "20"
        } 
        if (pbEvent.postback.data === "รางวัลเลขหน้า 3 ตัว") {
            amount = "40"
        } 
        if (pbEvent.postback.data === "รางวัลเลขท้าย 3 ตัว") {
            amount = "40"
        } 
        if (pbEvent.postback.data === "รางวัลเลขท้าย 2 ตัว") {
            amount = "20"
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





const imageProcess = async (req : express.Request) =>{
    let event : line.MessageEvent = req.body.events[0]
    let replyToken : string = event.replyToken
    console.log("IMAGE EVENT")

    try {
        let stream : Readable = await getImageContent(event.message.id)
        let data: Buffer[] = []
        stream.on("data",(chunk : Buffer)=>{
            // console.log(chunk)
            data.push(chunk)
        })

        stream.on("end", ()=> {
            
            lottoCheck(data,replyToken)
            .then(()=>{
                console.log("DONE lotto")
            })
            .catch( err => {
                throw new Error(err)
            })

        })
    }catch (err){
        await replyMessage(replyToken,err)
    }
}

const lottoCheck = async (data : Buffer[],replyToken : string) => {
    try{
        let result : string = await requestPromise.post({
            uri: "https://us-central1-k-happy-lotto.cloudfunctions.net/scanLotto",
            headers :  {
                'Accept-Encoding' : 'gzip, deflate',
                'Content-Type' : 'image/jpeg',
                'Connection' : 'keep-alive',
                'Cache-Control' : 'no-cache'
            },
            body: Buffer.concat(data)
        })
    
        let rst : any[] = JSON.parse(result)
    
        if (rst.length >0){
            let lotto = {
                number : rst[0]["number"],
                round : rst[0]["round"],
                set : rst[0]["set"],
                lottoDate : rst[0]["lottoDate"]
            }
    
            console.log(rst)
            let resultLotto  : string[] = await requestPromise.post({
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
            console.log(resultLotto)
            let flexJson :any
    
            if (resultLotto.length >0){
                flexJson =  new lottoWinner(lotto.number,lotto.round,resultLotto[0],lotto.lottoDate).getLottoJson()
    
            }
            else {
                flexJson =  new lottoLoser(lotto.number,lotto.round,lotto.lottoDate).getLottoJson()
            }
    
            await Client.replyMessage(replyToken,flexJson)
        }
        else {
            await replyMessage(replyToken,"เราไม่เจอเลขหวยของคุณ กรุณาลองใหม่อีกครั้ง")
        }
    }
    catch (err){
        throw new Error(err)
    }

}

const replyMessage = (replyMsg : string ,replyToken : string) => {
    let msg  : any= new textMessage(replyMsg).getJson()
    return Client.replyMessage(replyToken,msg)
}

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