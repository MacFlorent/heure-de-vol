import { openDB, DBSchema, IDBPDatabase } from 'idb';

import { Flight } from '@/types/flight';
import { Logbook, LogbookFactory } from '@/types/logbook';
import { AppSettings, AppSettingsFactory } from '@/types/settings';

interface HdvSchema extends DBSchema {
  settings: {
    key: 'default';
    value: AppSettings;
  };
  logbooks: {
    key: string;
    value: Logbook;
    indexes: {
      byCreated: string;
    };
  };
  flights: {
    key: number;
    value: Flight;
    indexes: {
      byLogbook: string;
      byDate: string;
      byAircraftType: string;
      byLogbookAndDate: [string, string];
    };
  };
}

class HdvDatabase {
  private dbPromise: Promise<IDBPDatabase<HdvSchema>>;
  private initialized: boolean = false;

  constructor() {
    this.dbPromise = openDB<HdvSchema>('HdvDatabase', 1, {
      upgrade(db) {
        // Create settings store
        db.createObjectStore('settings', { keyPath: 'id' });

        // Create logbooks store with indexes
        const logbookStore = db.createObjectStore('logbooks', { keyPath: 'id' });
        logbookStore.createIndex('byCreated', 'created');

        // Create flights store with indexes
        const flightStore = db.createObjectStore('flights', {
          keyPath: 'id',
          autoIncrement: true
        });
        flightStore.createIndex('byLogbook', 'logbookId');
        flightStore.createIndex('byDate', 'date');
        flightStore.createIndex('byAircraftType', 'aircraftType');
        flightStore.createIndex('byLogbookAndDate', ['logbookId', 'date']);
      }
    });
  }

  // Initialize database on first run
  async initialize() {
    if (this.initialized) return;

    const db = await this.dbPromise;

    // Check if settings exist
    const settings = await db.get('settings', 'default');

    if (!settings) {
      // First run - create default logbook and settings
      const defaultLogbook = LogbookFactory.create('My Logbook', 'Default logbook');
      await db.add('logbooks', defaultLogbook);

      const defaultSettings = AppSettingsFactory.default(defaultLogbook.id);
      await db.add('settings', defaultSettings);
    }

    this.initialized = true;
  }

  // Settings methods
  async getSettings(): Promise<AppSettings | undefined> {
    const db = await this.dbPromise;
    return db.get('settings', 'default');
  }

  async updateSettings(settings: AppSettings) {
    const db = await this.dbPromise;
    return db.put('settings', settings);
  }

  // Logbook methods
  async addLogbook(logbook: Logbook) {
    const db = await this.dbPromise;
    return db.add('logbooks', logbook);
  }

  async getAllLogbooks(): Promise<Logbook[]> {
    const db = await this.dbPromise;
    return db.getAll('logbooks');
  }

  async getLogbook(id: string): Promise<Logbook | undefined> {
    const db = await this.dbPromise;
    return db.get('logbooks', id);
  }

  async updateLogbook(logbook: Logbook) {
    const db = await this.dbPromise;
    return db.put('logbooks', logbook);
  }

  async deleteLogbook(id: string) {
    const db = await this.dbPromise;
    // Note: Consider adding cascade delete for flights in this logbook
    return db.delete('logbooks', id);
  }

  async getDefaultLogbook(): Promise<Logbook | undefined> {
    const settings = await this.getSettings();
    if (settings?.defaultLogbookId) {
      return this.getLogbook(settings.defaultLogbookId);
    }

    // Fallback: return first logbook
    const logbooks = await this.getAllLogbooks();
    return logbooks[0];
  }

  // Flight methods
  async addFlight(flight: Flight) {
    const db = await this.dbPromise;
    return db.add('flights', flight);
  }

  async getAllFlights(): Promise<Flight[]> {
    const db = await this.dbPromise;
    return db.getAll('flights');
  }

  async getFlightsByLogbook(logbookId: string): Promise<Flight[]> {
    const db = await this.dbPromise;
    return db.getAllFromIndex('flights', 'byLogbook', logbookId);
  }

  async getFlightsByAircraftType(aircraftType: string): Promise<Flight[]> {
    const db = await this.dbPromise;
    return db.getAllFromIndex('flights', 'byAircraftType', aircraftType);
  }

  async getFlight(id: number): Promise<Flight | undefined> {
    const db = await this.dbPromise;
    return db.get('flights', id);
  }

  async updateFlight(flight: Flight) {
    const db = await this.dbPromise;
    return db.put('flights', flight);
  }

  async deleteFlight(id: number) {
    const db = await this.dbPromise;
    return db.delete('flights', id);
  }

  async getTotalFlightTime(logbookId?: string): Promise<number> {
    const flights = logbookId
      ? await this.getFlightsByLogbook(logbookId)
      : await this.getAllFlights();

    return flights.reduce((total, flight) => {
      const [hours, minutes] = flight.totalTime.split(':').map(Number);
      return total + (hours || 0) + (minutes || 0) / 60;
    }, 0);
  }
}

export const hdvDatabase = new HdvDatabase();
