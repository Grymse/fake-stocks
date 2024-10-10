import { IndexedDB } from "./IndexedDB";

export interface IDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  save(name: string, data: string): Promise<DatabaseRecord>;
  load(id: string): Promise<DatabaseRecord>;
  list(): Promise<DatabaseRecordWithoutData[]>;
  delete(id: string): Promise<void>;
}

export type DatabaseRecordWithoutData = Omit<DatabaseRecord, "data">;

export type DatabaseRecord = {
  id: string;
  name: string;
  data: string;
  createdAt: Date;
  ownerId: string | null;
  ownerName: string | null;
};

// Export a singleton instance of the IndexedDB class
const db = new IndexedDB();
db.connect();
export { db };
