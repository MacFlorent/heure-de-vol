import { IDBPDatabase } from "idb";
import { HdvSchema } from "./schema";
import { AppSettings } from "@/types/app-settings";
import { STORE_NAMES } from "./constants";

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
