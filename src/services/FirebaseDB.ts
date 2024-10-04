import { app } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { IDatabase } from "./IDatabase";

// TODO: Add authentication check before accessing the database
// TODO: Add security rules to the Firestore database
// TODO: Add error handling for database operations
// TODO: Add loading indicators for database operations
// TODO: Add logging for database operations
// TODO: Add index for the games collection to fetch the list of games faster

export class FirebaseDB implements IDatabase {
  connect(): Promise<void> {
    return Promise.resolve();
  }

  disconnect(): Promise<void> {
    return Promise.resolve();
  }

  async save(name: string, data: string): Promise<void> {
    const gamesCollection = this.getGamesCollection();
    const gameDoc = doc(gamesCollection, name);
    return setDoc(gameDoc, { data });
  }

  getGamesCollection() {
    const db = getFirestore(app);
    const auth = getAuth();
    if (!auth.currentUser) {
      throw new Error("User not logged in");
    }

    const userCollection = collection(db, "users");
    const userDoc = doc(userCollection, auth.currentUser.uid);
    return collection(userDoc, "games");
  }

  async load(name: string): Promise<string> {
    const gamesCollection = this.getGamesCollection();
    const gameDoc = doc(gamesCollection, name);
    const downloadedDoc = await getDoc(gameDoc);
    if (!downloadedDoc.exists()) {
      throw new Error("Game not found");
    }
    return downloadedDoc.data().data;
  }

  async list(): Promise<string[]> {
    const gamesCollection = this.getGamesCollection();
    const snapshot = await getDocs(gamesCollection);
    const keys = snapshot.docs.map((doc) => doc.id);
    return keys;
  }

  delete(name: string): Promise<void> {
    const gamesCollection = this.getGamesCollection();
    const gameDoc = doc(gamesCollection, name);
    return deleteDoc(gameDoc);
  }
}
