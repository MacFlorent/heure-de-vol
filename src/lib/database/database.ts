import { openDB, IDBPDatabase } from "idb";
import { HdvSchema } from "./schema";
import { SettingsRepository } from "./settings-repository";
import { AircraftTypesRepository } from "./aircraft-types-repository";
import { LogbooksRepository } from "./logbooks-repository";
import { FlightsRepository } from "./flights-repository";
import { Logbook, LogbookFactory } from "@/types/logbook";
import { AppSettingsFactory } from "@/types/app-settings";
import { STORE_NAMES } from "./constants";

export class HdvDatabase {
  private dbPromise: Promise<IDBPDatabase<HdvSchema>>;
  private initPromise?: Promise<void>;

  // Repository instances
  public readonly settings: SettingsRepository;
  public readonly aircraftTypes: AircraftTypesRepository;
  public readonly logbooks: LogbooksRepository;
  public readonly flights: FlightsRepository;

  constructor() {
    this.dbPromise = openDB<HdvSchema>("HdvDatabase", 1, {
      upgrade(db) {
        // AppSettings store
        db.createObjectStore(STORE_NAMES.APP_SETTINGS, { keyPath: "id" });

        // AircraftTypes store
        db.createObjectStore(STORE_NAMES.AIRCRAFT_TYPES, { keyPath: "id" });

        // Logbooks store with indexes
        const logbookStore = db.createObjectStore(STORE_NAMES.LOGBOOKS, { keyPath: "id" });
        logbookStore.createIndex("byCreated", "created");

        // Flights store with indexes
        const flightStore = db.createObjectStore(STORE_NAMES.FLIGHTS, {
          keyPath: "id",
          autoIncrement: true
        });
        flightStore.createIndex("byLogbook", "logbookId");
        flightStore.createIndex("byDate", "date");
        flightStore.createIndex("byAircraftType", "aircraftType");
        flightStore.createIndex("byLogbookAndDate", ["logbookId", "date"]);
      }
    });

    // Repositories
    this.settings = new SettingsRepository(this.dbPromise);
    this.aircraftTypes = new AircraftTypesRepository(this.dbPromise);
    this.logbooks = new LogbooksRepository(this.dbPromise);
    this.flights = new FlightsRepository(this.dbPromise);
  }

  // Initialization
  async initialize(): Promise<void> {
    // Return existing initialization if already in progress or completed
    if (this.initPromise) return this.initPromise;

    // Create and store the initialization promise
    this.initPromise = (async () => {
      const db = await this.dbPromise;

      // Check if settings exist
      const settings = await db.get(STORE_NAMES.APP_SETTINGS, "default");

      if (!settings) {
        // First run - create default logbook and settings
        const defaultLogbook = LogbookFactory.fromObject({
          name: "My Logbook",
          description: "Default logbook"
        });
        await db.add(STORE_NAMES.LOGBOOKS, defaultLogbook);

        const defaultSettings = AppSettingsFactory.fromObject({
          defaultLogbookId: defaultLogbook.id
        });
        await db.add(STORE_NAMES.APP_SETTINGS, defaultSettings);
      }
    })();

    return this.initPromise;
  }

  async getDefaultLogbook(): Promise<Logbook | undefined> {
    const settings = await this.settings.getSettings();
    if (settings?.defaultLogbookId) {
      return this.logbooks.getLogbook(settings.defaultLogbookId);
    }

    // Fallback: return first logbook
    const logbooks = await this.logbooks.getAllLogbooks();
    return logbooks[0];
  }
}
