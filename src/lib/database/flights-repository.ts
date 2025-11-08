import { IDBPDatabase } from "idb";
import { HdvSchema } from "./schema";
import { Flight } from "@/types/flight";
import { STORE_NAMES } from "./constants";

export class FlightsRepository {
  constructor(private dbPromise: Promise<IDBPDatabase<HdvSchema>>) {}

  async addFlight(flight: Flight) {
    const db = await this.dbPromise;
    return db.add(STORE_NAMES.FLIGHTS, flight);
  }

  async getAllFlights(): Promise<Flight[]> {
    const db = await this.dbPromise;
    return db.getAll(STORE_NAMES.FLIGHTS);
  }

  async getFlightsByLogbook(logbookId: string): Promise<Flight[]> {
    const db = await this.dbPromise;
    return db.getAllFromIndex(STORE_NAMES.FLIGHTS, "byLogbook", logbookId);
  }

  async getFlightsByAircraftType(aircraftType: string): Promise<Flight[]> {
    const db = await this.dbPromise;
    return db.getAllFromIndex(STORE_NAMES.FLIGHTS, "byAircraftType", aircraftType);
  }

  async getFlight(id: number): Promise<Flight | undefined> {
    const db = await this.dbPromise;
    return db.get(STORE_NAMES.FLIGHTS, id);
  }

  async updateFlight(flight: Flight) {
    const db = await this.dbPromise;
    return db.put(STORE_NAMES.FLIGHTS, flight);
  }

  async deleteFlight(id: number) {
    const db = await this.dbPromise;
    return db.delete(STORE_NAMES.FLIGHTS, id);
  }

  async getTotalFlightTime(logbookId?: string): Promise<number> {
    const flights = logbookId
      ? await this.getFlightsByLogbook(logbookId)
      : await this.getAllFlights();

    return flights.reduce((total, flight) => {
      return total + (flight.timeTotal || 0);
    }, 0);
  }
}
