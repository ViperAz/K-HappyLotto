import * as functions from 'firebase-functions';
import * as line from '@line/bot-sdk'
import * as express from 'express'

/**
 * Dialogflow ? nahh who need dialogflow when we have k-happyFlow
 * 
 */

 const replyMsg = {
     default : "ขอโทษฮะพิมอะไรไม่รู้เรื่องเลย"
 }
const Client = new line.Client({channelAccessToken : '8YPInaLsR0Ihyte/TVBrOg7NPmBE8VTghj4ctBqZ4D7ovuBcFAjYpIRhbbWisppI2juj7MJSAiAkJaIDs+0QvwXFTwkHkjFbrxgPaoFgVK4NY9t5tD3zwvnkbcCk62DmWDwT68EOoyiEIVV9RL31DQdB04t89/1O/w1cDnyilFU='})

const cors = require('cors')
const app = express()

app.use(cors({origin : true}))

app.post('*', (req,res)=> {
    console.log("AM IN")
    console.log(req.body.events[0].text)


    switch (req.body.events[0].text) {
        case "สมัครสมาชิก":
        case "register" :
            //triggered regis mock up function

        case "ตรวจหวย" :
        case "" :

        default : 
            Client.replyMessage(req.body.events[0].replyToken,{type :"text", text : replyMsg.default})
            .then ( () =>{
                res.status(200).end()
            })
            .catch( err =>{
                console.error(err)
                res.send(err).status(500).end()
            })
    }

    
    Client.replyMessage(req.body.events[0].replyToken,{type :"text", text : req.body.events[0].message.text})
    .then( () =>{
        console.log("OK ?????????????????????????????")
        res.status(200).end()
    })
    .catch( err =>{
        console.error(err)
        res.send(err).status(500).end()
    })
    // res.status(404).end()
}   
)

// const lineApiGateWay = functions.https.onRequest((req,res) =>{

//     let data = req.body.events[0].message.

//     if (req.method == 'POST'){


        

//     }

//     Client.pushMessage("U2d493044794b863dee491bfc35596921",{type :"text", text : "eiei"})
//     .then( () =>{
//         console.log("Kwai")
//     }

//     )
//     .catch( err => {
//         console.error(err)
//     })
    

//     console.log("EIEIEIEIEIEEI")

//     res.status(200).end()
// })

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.lineApiGateWay = functions.https.onRequest(app)


// export {
//     lineApiTest
// }