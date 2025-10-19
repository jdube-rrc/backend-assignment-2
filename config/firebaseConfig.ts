import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// You'll need to replace this with your actual service account file name
import serviceAccount from "../back-end-module-3-dcb5d-firebase-adminsdk-fbsvc-60b3c04656.json";

// initialize the Firebase app with our service account key
initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
});

// get a reference to the firestore database
const db: Firestore = getFirestore();

export { db };
