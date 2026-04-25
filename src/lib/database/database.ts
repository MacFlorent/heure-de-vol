import { openDB, IDBPDatabase, IDBPTransaction, StoreNames } from "idb";
import { logger } from "@/utils/logger";
import { AppSettingsFactory } from "@/types/app-settings";
import { Logbook, LogbookFactory } from "@/types/logbook";
import { STORE_NAMES } from "./constants";
import { HdvSchema } from "./schema";
import { SettingsRepository } from "./settings-repository";
import { AircraftTypesRepository } from "./aircraft-types-repository";
import { LogbooksRepository } from "./logbooks-repository";
import { FlightsRepository } from "./flights-repository";

export class HdvDatabase {
  private dbPromise: Promise<IDBPDatabase<HdvSchema>>;

  // Repository instances
  public readonly settings: SettingsRepository;
  public readonly aircraftTypes: AircraftTypesRepository;
  public readonly logbooks: LogbooksRepository;
  public readonly flights: FlightsRepository;

  constructor() {
    this.dbPromise = openDB<HdvSchema>("HdvDatabase", 2, {
      upgrade: async (database, oldVersion, newVersion, transaction) => {
        logger.info(`HdvDatabase: upgrading database from version ${oldVersion} to version ${database.version} [${newVersion}]`);

        HdvDatabase.createObjectStores(database);

        if (oldVersion === 0) {
          await HdvDatabase.initializeDefaultData(transaction);
        }
      }
    });

    // Repositories
    this.settings = new SettingsRepository(this.dbPromise);
    this.aircraftTypes = new AircraftTypesRepository(this.dbPromise);
    this.logbooks = new LogbooksRepository(this.dbPromise);
    this.flights = new FlightsRepository(this.dbPromise);

    logger.info("HdvDatabase: connection established, repositories initialized");
  }

  private static createObjectStores(database: IDBPDatabase<HdvSchema>) {
    logger.info("HdvDatabase: create all stores that do not exist");
    // AppSettings store
    if (!database.objectStoreNames.contains(STORE_NAMES.APP_SETTINGS)) {
      database.createObjectStore(STORE_NAMES.APP_SETTINGS, { keyPath: "id" });
    }

    // AircraftTypes store
    if (!database.objectStoreNames.contains(STORE_NAMES.AIRCRAFT_TYPES)) {
      database.createObjectStore(STORE_NAMES.AIRCRAFT_TYPES, { keyPath: "id" });
    }

    // Logbooks store with indexes
    if (!database.objectStoreNames.contains(STORE_NAMES.LOGBOOKS)) {
      const logbookStore = database.createObjectStore(STORE_NAMES.LOGBOOKS, { keyPath: "id" });
      logbookStore.createIndex("byCreated", "created");
    }

    // Flights store with indexes
    if (!database.objectStoreNames.contains(STORE_NAMES.FLIGHTS)) {
      const flightStore = database.createObjectStore(STORE_NAMES.FLIGHTS, { keyPath: "id" });
      flightStore.createIndex("byLogbook", "logbookId");
      flightStore.createIndex("byDate", "date");
      flightStore.createIndex("byAircraftType", "aircraftType");
      flightStore.createIndex("byLogbookAndDate", ["logbookId", "date"]);
    }
  }

  private static async initializeDefaultData(
    transaction: IDBPTransaction<HdvSchema, StoreNames<HdvSchema>[], "versionchange">
  ): Promise<void> {
    logger.info("HdvDatabase: first run - creating default logbook and settings");

    const defaultLogbook = LogbookFactory.fromObject({
      name: "My Logbook",
      description: "Default logbook"
    });
    await transaction.objectStore(STORE_NAMES.LOGBOOKS).add(defaultLogbook);

    const defaultSettings = AppSettingsFactory.fromObject({
      defaultLogbookId: defaultLogbook.id
    });
    await transaction.objectStore(STORE_NAMES.APP_SETTINGS).add(defaultSettings);

    logger.info(`HdvDatabase: default logbook created with ID: ${defaultLogbook.id}`);
  }

  async getDefaultLogbook(): Promise<Logbook | undefined> {
    const settings = await this.settings.getSettings();
    if (settings?.defaultLogbookId) {
      logger.info(`HdvDatabase: retrieving default logbook with ID: ${settings.defaultLogbookId}`);
      return this.logbooks.getLogbook(settings.defaultLogbookId);
    }

    // Fallback: return first logbook
    logger.info("HdvDatabase: no default logbook set, returning first available logbook");
    const logbooks = await this.logbooks.getAllLogbooks();
    return logbooks[0];
  }

  async deleteLogbookWithFlights(id: string) {
    const db = await this.dbPromise;
    const tx = db.transaction([STORE_NAMES.LOGBOOKS, STORE_NAMES.FLIGHTS], "readwrite");

    const flightKeys = await tx.objectStore(STORE_NAMES.FLIGHTS).index("byLogbook").getAllKeys(id);
    await Promise.all(flightKeys.map(key => tx.objectStore(STORE_NAMES.FLIGHTS).delete(key)));
    await tx.objectStore(STORE_NAMES.LOGBOOKS).delete(id);

    await tx.done;
  }
}
