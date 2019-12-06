import * as functions from 'firebase-functions'

import {app as lottoApp} from './lottery'
import {app as lineApp} from './line'



exports.lineApiGateWay = functions.https.onRequest(lineApp)


exports.lottoApi = functions.https.onRequest(lottoApp)