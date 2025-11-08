import { IDBPDatabase } from "idb";
import { HdvSchema } from "./schema";
import { Logbook } from "@/types/logbook";
import { STORE_NAMES } from "./constants";

export class LogbooksRepository {
  constructor(private dbPromise: Promise<IDBPDatabase<HdvSchema>>) {}

  async addLogbook(logbook: Logbook) {
    const db = await this.dbPromise;
    return db.add(STORE_NAMES.LOGBOOKS, logbook);
  }

  async getAllLogbooks(): Promise<Logbook[]> {
    const db = await this.dbPromise;
    return db.getAll(STORE_NAMES.LOGBOOKS);
  }

  async getLogbook(id: string): Promise<Logbook | undefined> {
    const db = await this.dbPromise;
    return db.get(STORE_NAMES.LOGBOOKS, id);
  }

  async updateLogbook(logbook: Logbook) {
    const db = await this.dbPromise;
    return db.put(STORE_NAMES.LOGBOOKS, logbook);
  }

  async deleteLogbook(id: string) {
    const db = await this.dbPromise;
    // Note: Consider adding cascade delete for flights in this logbook
    return db.delete(STORE_NAMES.LOGBOOKS, id);
  }
}
