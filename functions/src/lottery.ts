import *  as express from 'express'
// import * as fbAdmin from 'firebase-admin'
// import * as functions from 'firebase-functions'



// fbAdmin.initializeApp(functions.config().firebase)

// let fsDb = fbAdmin.firestore()

const app = express()



app.get('/lotto/:lotto/date/:date',(req : express.Request , res : express.Response) =>{
    
    
    res.send(req.params).status(200).end()

})



export{
    app 
}

