import * as functions from 'firebase-functions'

import {app as lottoApp} from './lottery'
import {app as lineApp} from './line'



const lineApiGateWay = functions.https.onRequest(lineApp)


const lottoApi = functions.https.onRequest(lottoApp)

const fullfillment = functions.https.onRequest((req,res) => {

    res.status(200).end()
})


export {
    lottoApi,
    lineApiGateWay,
    fullfillment
}