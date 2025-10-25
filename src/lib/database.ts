import { openDB, DBSchema, IDBPDatabase } from 'idb';

import { Flight } from '@/types/flight';

interface HdvSchema extends DBSchema {
  flight: {
    key: number;
    value: Flight;
    indexes: {
      byDate: string;
      byAircraftType: string;
    };
  };
}

class HdvDatabase {
  private dbPromise: Promise<IDBPDatabase<HdvSchema>>;

  constructor() {
    this.dbPromise = openDB<HdvSchema>('HdvDatabase', 1, {
      upgrade(db) {
        const flightStore = db.createObjectStore('flight', {
          keyPath: 'id',
          autoIncrement: true
        });

        flightStore.createIndex('byDate', 'date');
        flightStore.createIndex('byAircraftType', 'aircraftType');
      }
    });
  }

  async addFlight(flight: Flight) {
    const db = await this.dbPromise;
    return db.add('flight', flight);
  }

  async getAllFlights() {
    const db = await this.dbPromise;
    return db.getAll('flight');
  }

  async getFlightsByAircraftType(aircraftType: string) {
    const db = await this.dbPromise;
    return db.getAllFromIndex('flight', 'byAircraftType', aircraftType);
  }

  async updateFlight(flight: Flight) {
    const db = await this.dbPromise;
    return db.put('flight', flight);
  }

  async deleteFlight(id: number) {
    const db = await this.dbPromise;
    return db.delete('flight', id);
  }

  async getTotalFlightTime() {
    const flights = await this.getAllFlights();
    return flights.reduce((total, flight) => {
      const [hours, minutes] = flight.totalTime.split(':').map(Number);
      return total + (hours || 0) + (minutes || 0) / 60;
    }, 0);
  }
}

export const hdvDatabase = new HdvDatabase();
