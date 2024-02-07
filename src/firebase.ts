import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
// import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: 'AIzaSyB0nXYKbG3TiF9Nr1KIGHMs00T7bD9l1Jk',
    authDomain: 'inwardfilemovement.firebaseapp.com',
    projectId: 'inwardfilemovement',
    storageBucket: 'inwardfilemovement.appspot.com',
    messagingSenderId: '323000452824',
    appId: '1:323000452824:web:6907c6a6cce36c76d039ad',
    measurementId: 'G-RKWX2L5T9S',
}

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const auth = getAuth(app)
auth.languageCode = 'en'

export { db, auth }
