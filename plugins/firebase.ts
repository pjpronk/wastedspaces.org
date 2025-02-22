// plugins/firebase.ts
import { defineNuxtPlugin } from "#app"
import { initializeApp, type FirebaseOptions } from "firebase/app"
import { getFirestore } from "firebase/firestore"

export default defineNuxtPlugin((_nuxtApp) => {
  const config = useRuntimeConfig()

  const firebaseConfig: FirebaseOptions = {
    apiKey: config.public.firebaseApiKey as string,
    authDomain: config.public.firebaseAuthDomain as string,
    projectId: config.public.firebaseProjectId as string,
    storageBucket: config.public.firebaseStorageBucket as string,
    messagingSenderId: config.public.firebaseMessagingSenderId as string,
    appId: config.public.firebaseAppId as string,
    measurementId: config.public.firebaseMeasurementId as string
  }

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  return {
    provide: {
      db
    }
  }
})
