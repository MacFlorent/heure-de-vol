import { IDBPDatabase } from "idb";
import { HdvSchema } from "./schema";
import { AircraftType } from "@/types/aircraft-type";
import { STORE_NAMES } from "./constants";

export class AircraftTypesRepository {
  constructor(private dbPromise: Promise<IDBPDatabase<HdvSchema>>) {}

  async addAircraftType(aircraftType: AircraftType) {
    const db = await this.dbPromise;
    return db.add(STORE_NAMES.AIRCRAFT_TYPES, aircraftType);
  }

  async getAllAircraftTypes(): Promise<AircraftType[]> {
    const db = await this.dbPromise;
    return db.getAll(STORE_NAMES.AIRCRAFT_TYPES);
  }

  async getAircraftType(id: string): Promise<AircraftType | undefined> {
    const db = await this.dbPromise;
    return db.get(STORE_NAMES.AIRCRAFT_TYPES, id);
  }

  async updateAircraftType(aircraftType: AircraftType) {
    const db = await this.dbPromise;
    return db.put(STORE_NAMES.AIRCRAFT_TYPES, aircraftType);
  }

  async deleteAircraftType(id: string) {
    const db = await this.dbPromise;
    return db.delete(STORE_NAMES.AIRCRAFT_TYPES, id);
  }
}
