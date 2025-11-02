export interface Logbook {
  id: string;                       // UUID
  name: string;                     // User-chosen name
  description?: string;             // Optional description
  created: string;                  // ISO 8601 creation date
  enabledFields?: LogbookFieldConfig; // Field visibility configuration (Phase 2)
}

/**
 * Controls which fields are visible/enabled in the flight form for this logbook.
 * Allows different logbooks to track different metrics (e.g., Real Aviation vs. DCS Combat).
 * Undefined fields default to false (hidden).
 */
export interface LogbookFieldConfig {
  // Time categories
  picTime?: boolean;
  dualReceived?: boolean;
  soloTime?: boolean;
  nightTime?: boolean;
  ifrActual?: boolean;
  ifrSimulated?: boolean;
  crossCountry?: boolean;

  // Landings
  dayLandings?: boolean;
  nightLandings?: boolean;

  // Aircraft characteristics (EASA/European)
  multiEngine?: boolean;
  variablePitch?: boolean;
  retractableGear?: boolean;
  tailwheel?: boolean;

  // Approaches
  approaches?: boolean;
  approachTypes?: boolean;

  // Simulator/gaming
  carrierTraps?: boolean;
  airToAirKills?: boolean;
  aerialRefueling?: boolean;

  // Roles
  instructor?: boolean;
  checkRide?: boolean;
}

export class LogbookFactory {
  static empty(): Logbook {
    return {
      id: crypto.randomUUID(),
      name: "",
      description: undefined,
      created: new Date().toISOString(),
      enabledFields: undefined
    };
  }

  static create(name: string, description?: string, enabledFields?: LogbookFieldConfig): Logbook {
    return {
      id: crypto.randomUUID(),
      name,
      description,
      created: new Date().toISOString(),
      enabledFields
    };
  }

  static fromObject(obj: Partial<Logbook>): Logbook {
    return {
      id: obj.id ?? crypto.randomUUID(),
      name: obj.name ?? "",
      description: obj.description ?? undefined,
      created: obj.created ?? new Date().toISOString(),
      enabledFields: obj.enabledFields ?? undefined
    };
  }
}
