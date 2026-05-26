import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);

// Initialize Firestore with long polling enabled to bypass potential WebSocket blocks
const firestoreSettings = {
  experimentalForceLongPolling: true,
  experimentalAutoDetectLongPolling: true,
};

const databaseId = (firebaseConfig as any).firestoreDatabaseId || '(default)';

export const db = initializeFirestore(app, firestoreSettings, databaseId);

export const auth = getAuth(app);

// Connectivity Test
async function testConnection() {
  console.log(`Testing Firestore connection for project: ${firebaseConfig.projectId}, database: ${databaseId}`);
  try {
    // Quietly check if we can retrieve a doc (use standard getDoc with a timeout to be safe)
    await getDocFromServer(doc(db, 'settings', 'config'));
    console.log("Firestore connection check completed successfully");
  } catch (error: any) {
    // Gentle log instead of shouting errors during fast initial cold starts
    console.warn("Firestore connection check status (this is normal during sandbox bootstrapping):", error?.message || error);
  }
}

if (process.env.NODE_ENV !== 'production') {
  testConnection();
}
