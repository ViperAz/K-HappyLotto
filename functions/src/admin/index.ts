import * as admin from 'firebase-admin'
// import * as functions from 'firebase-functions'

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://k-happy-lotto.firebaseio.com'
})

const firestore = admin.firestore()

const storage = admin.storage()

export {
    firestore,
    storage
}