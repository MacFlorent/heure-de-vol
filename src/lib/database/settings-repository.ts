import { IDBPDatabase } from "idb";
import { HdvSchema } from "./schema";
import { STORE_NAMES } from "./constants";
import { AppSettings } from "@/types/app-settings";

export class SettingsRepository {
  constructor(private dbPromise: Promise<IDBPDatabase<HdvSchema>>) {}

  async getSettings(): Promise<AppSettings | undefined> {
    const db = await this.dbPromise;
    return db.get(STORE_NAMES.APP_SETTINGS, "default");
  }

  async updateSettings(settings: AppSettings) {
    const db = await this.dbPromise;
    return db.put(STORE_NAMES.APP_SETTINGS, settings);
  }
}
