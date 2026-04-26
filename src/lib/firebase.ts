import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);

// Initialize Firestore with long polling enabled to bypass potential WebSocket blocks
const firestoreSettings = {
  experimentalForceLongPolling: true,
};

const databaseId = firebaseConfig.firestoreDatabaseId || '(default)';

export const db = initializeFirestore(app, firestoreSettings, databaseId);

export const auth = getAuth(app);

// Connectivity Test
async function testConnection() {
  console.log(`Testing Firestore connection for project: ${firebaseConfig.projectId}, database: ${databaseId}`);
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firestore connection successful");
  } catch (error) {
    console.error("Firestore connectivity test results:", error);
    if (error instanceof Error) {
      if (error.message.includes('the client is offline') || (error as any).code === 'unavailable') {
        console.error("Firestore appears to be unreachable. This may be due to network restrictions, invalid configuration, or quota limits.");
      }
    }
  }
}

if (process.env.NODE_ENV !== 'production') {
  testConnection();
}
