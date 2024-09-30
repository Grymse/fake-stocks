import { IndexedDB } from "./indexedDB";

export interface Database {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  save(name: string, data: string): Promise<void>;
  load(name: string): Promise<string>;
  list(): Promise<string[]>;
}

// Export a singleton instance of the IndexedDB class
const db = new IndexedDB();
db.connect();
export { db };
