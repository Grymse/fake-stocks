import { app } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import {
  DatabaseRecord,
  DatabaseRecordWithoutData,
  IDatabase,
} from "./IDatabase";

export class FirebaseDB implements IDatabase {
  connect(): Promise<void> {
    return Promise.resolve();
  }

  disconnect(): Promise<void> {
    return Promise.resolve();
  }

  async save(name: string, data: string): Promise<DatabaseRecord> {
    const gamesCollection = this.getGamesCollection();

    const auth = getAuth();

    const docRef = await addDoc(gamesCollection, {
      name,
      data,
      createdAt: new Date(),
      ownerId: auth.currentUser?.uid ?? null,
      ownerName: auth.currentUser?.displayName ?? null,
    });

    return this.load(docRef.id);
  }

  private getGamesCollection() {
    return collection(getFirestore(app), "stock-markets");
  }

  async load(id: string): Promise<DatabaseRecord> {
    const gamesCollection = this.getGamesCollection();
    const docSnapshot = await getDoc(doc(gamesCollection, id));

    if (!docSnapshot.exists()) {
      throw new Error("Game not found");
    }

    return { ...docSnapshot.data(), id: docSnapshot.id } as DatabaseRecord;
  }

  async list(): Promise<DatabaseRecordWithoutData[]> {
    const auth = getAuth();
    if (!auth.currentUser) {
      throw new Error("User not logged in");
    }

    const gamesCollection = this.getGamesCollection();
    const q = query(
      gamesCollection,
      where("ownerId", "==", auth.currentUser.uid)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: new Date(data.createdAt.seconds * 1000),
      } as DatabaseRecordWithoutData;
    });
  }

  async delete(id: string): Promise<void> {
    const gamesCollection = this.getGamesCollection();
    const gameDoc = doc(gamesCollection, id);
    return deleteDoc(gameDoc);
  }
}
