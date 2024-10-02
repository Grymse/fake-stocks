import { IDatabase } from "./IDatabase";

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("FakeStocks", 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("games")) {
        db.createObjectStore("games", { keyPath: "name" });
      }
    };

    request.onsuccess = (event: Event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject(
        "Error opening database: " +
          (event.target as IDBOpenDBRequest).error?.message
      );
    };
  });
};

export class IndexedDB implements IDatabase {
  private db: IDBDatabase | null = null;

  async connect() {
    this.db = await openDB();
  }

  async disconnect() {
    this.db?.close();
    this.db = null;
  }

  async save(name: string, data: string) {
    if (!this.db) {
      throw new Error("Database is not connected");
    }

    const transaction = this.db.transaction(["games"], "readwrite");
    const store = transaction.objectStore("games");
    store.put({ name, data });

    return new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) =>
        // @ts-expect-error doesn't know about errorCode
        reject(new Error("Failed to save game: " + event.target.errorCode));
    });
  }

  async load(name: string) {
    if (!this.db) {
      throw new Error("Database is not connected");
    }

    const transaction = this.db.transaction(["games"], "readonly");
    const store = transaction.objectStore("games");
    const request = store.get(name);

    return new Promise<string>((resolve, reject) => {
      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.data);
        } else {
          reject(new Error("Game not found"));
        }
      };

      request.onerror = (event) =>
        // @ts-expect-error doesn't know about errorCode
        reject(new Error("Failed to load game: " + event.target.errorCode));
    });
  }

  async delete(name: string) {
    if (!this.db) {
      throw new Error("Database is not connected");
    }

    const transaction = this.db.transaction(["games"], "readwrite");
    const store = transaction.objectStore("games");
    store.delete(name);

    return new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) =>
        // @ts-expect-error doesn't know about errorCode
        reject(new Error("Failed to delete game: " + event.target.errorCode));
    });
  }

  async list() {
    if (!this.db) {
      throw new Error("Database is not connected");
    }

    const transaction = this.db.transaction(["games"], "readonly");
    const store = transaction.objectStore("games");
    const request = store.getAllKeys();

    return new Promise<string[]>((resolve, reject) => {
      // @ts-expect-error doesn't know about result, even though it's in the spec
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error("Failed to list games"));
    });
  }
}
