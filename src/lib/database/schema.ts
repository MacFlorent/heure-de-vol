import { DBSchema } from "idb";

import { Flight } from "@/types/flight";
import { Logbook } from "@/types/logbook";
import { AppSettings } from "@/types/app-settings";
import { AircraftType } from "@/types/aircraft-type";

export interface HdvSchema extends DBSchema {
  appSettings: {
    key: "default";
    value: AppSettings;
  };
  aircraftTypes: {
    key: string;
    value: AircraftType;
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
