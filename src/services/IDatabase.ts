import { IndexedDB } from "./IndexedDB";

export interface IDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  save(name: string, data: string): Promise<void>;
  load(name: string): Promise<string>;
  list(): Promise<string[]>;
  delete(name: string): Promise<void>;
}

// Export a singleton instance of the IndexedDB class
const db = new IndexedDB();
db.connect();
export { db };
