import * as functions from 'firebase-functions';
import * as line from '@line/bot-sdk'
// import * as express from 'express'



const Client = new line.Client({channelAccessToken : '8YPInaLsR0Ihyte/TVBrOg7NPmBE8VTghj4ctBqZ4D7ovuBcFAjYpIRhbbWisppI2juj7MJSAiAkJaIDs+0QvwXFTwkHkjFbrxgPaoFgVK4NY9t5tD3zwvnkbcCk62DmWDwT68EOoyiEIVV9RL31DQdB04t89/1O/w1cDnyilFU='})


// const app = express()


const lineApiTest = functions.https.onRequest((req,res) =>{

    Client.pushMessage("U2d493044794b863dee491bfc35596921",{type :"text", text : "eiei"})
    .then( () =>{
        console.log("Kwai")
    }

    )
    .catch( err => {
        console.error(err)
    })
    

    console.log("EIEIEIEIEIEEI")

    res.status(200).end()
})
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


export {
    lineApiTest
}