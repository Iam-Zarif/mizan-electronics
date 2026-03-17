import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const hasRequiredFirebaseConfig = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId,
);

let firebaseAppInstance: FirebaseApp | null = null;
let firebaseAuthInstance: Auth | null = null;
let googleProviderInstance: GoogleAuthProvider | null = null;
let analyticsInstance: Promise<Analytics | null> | null = null;

export const getFirebaseApp = () => {
  if (!hasRequiredFirebaseConfig) return null;

  if (!firebaseAppInstance) {
    firebaseAppInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }

  return firebaseAppInstance;
};

export const getFirebaseAuth = () => {
  if (typeof window === "undefined") return null;

  const app = getFirebaseApp();
  if (!app) return null;

  if (!firebaseAuthInstance) {
    firebaseAuthInstance = getAuth(app);
  }

  return firebaseAuthInstance;
};

export const getGoogleAuthProvider = () => {
  if (!googleProviderInstance) {
    googleProviderInstance = new GoogleAuthProvider();
    googleProviderInstance.setCustomParameters({ prompt: "select_account" });
  }

  return googleProviderInstance;
};

export const getFirebaseAnalytics = async () => {
  if (typeof window === "undefined") return null;

  const app = getFirebaseApp();
  if (!app) return null;

  if (!analyticsInstance) {
    analyticsInstance = isSupported().then((supported) =>
      supported ? getAnalytics(app) : null,
    );
  }

  return analyticsInstance;
};

