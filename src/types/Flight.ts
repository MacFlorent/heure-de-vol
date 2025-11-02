export interface Flight {
  // ===== CORE FIELDS (always required) =====
  id?: number;                    // Auto-assigned by IndexedDB
  logbookId: string;              // UUID reference to parent Logbook
  date: string;                   // ISO 8601 date
  aircraftType: string;           // Free-text (e.g., "DR221", "TB20", "F/A-18C")
  aircraftRegistration: string;   // Tail number (e.g., "F-BOZU", "N12345")
  departure: string;              // Airport code or name (e.g., "LFPZ", "KJFK")
  arrival: string;                // Airport code or name
  departureTime: string;          // Time (format TBD: HH:MM or ISO datetime)
  arrivalTime: string;            // Time (format TBD)
  totalTime: number;              // Flight duration in decimal hours (1.5 = 1h 30m)

  // ===== COMMON OPTIONAL FIELDS =====
  // Time categories (all decimal hours)
  picTime?: number;               // Pilot-in-Command time
  dualReceived?: number;          // Instruction received
  soloTime?: number;              // Solo flight time (student pilots)
  nightTime?: number;             // Night flight time (sunset to sunrise)
  ifrActual?: number;             // Actual IFR conditions (IMC)
  ifrSimulated?: number;          // Simulated IFR (hood/foggles)
  crossCountry?: number;          // XC time (>50nm from departure)

  // Landings (for currency tracking)
  dayLandings?: number;           // Day landings
  nightLandings?: number;         // Night landings (full-stop)

  // Aircraft characteristics (EASA/European approach)
  multiEngine?: number;           // Multi-engine time (ME)
  variablePitch?: number;         // Variable pitch propeller time (VP)
  retractableGear?: number;       // Retractable undercarriage time (RU)
  tailwheel?: number;             // Tailwheel time (for endorsement)

  // Approaches (for IFR currency)
  approaches?: number;            // Total instrument approaches
  approachTypes?: string[];       // e.g., ["ILS", "VOR", "RNAV"]

  // ===== FLIGHT TYPE =====
  isSimulator?: boolean;          // Real aircraft vs flight sim
  simulatorType?: string;         // e.g., "MSFS", "DCS", "X-Plane"

  // ===== ROLES =====
  instructor?: boolean;           // Providing instruction (FI/CFI)
  checkRide?: boolean;            // Practical test/checkride

  // ===== SIMULATOR/GAMING SPECIFIC =====
  carrierTraps?: number;          // Aircraft carrier landings
  airToAirKills?: number;         // Combat sim kills
  aerialRefueling?: boolean;      // AAR performed

  // ===== FREE-TEXT NOTES =====
  remarks?: string;               // Optional free-text notes
}

export class FlightFactory {
  static empty(logbookId: string): Flight {
    return {
      // Core fields
      id: undefined,
      logbookId,
      date: "",
      aircraftType: "",
      aircraftRegistration: "",
      departure: "",
      arrival: "",
      departureTime: "",
      arrivalTime: "",
      totalTime: 0,
      // All optional fields default to undefined (not included in object)
      remarks: undefined
    };
  }

  static fromObject(obj: Partial<Flight>, defaultLogbookId?: string): Flight {
    return {
      // Core fields (always included)
      id: obj.id ?? undefined,
      logbookId: obj.logbookId ?? defaultLogbookId ?? "",
      date: obj.date ?? "",
      aircraftType: obj.aircraftType ?? "",
      aircraftRegistration: obj.aircraftRegistration ?? "",
      departure: obj.departure ?? "",
      arrival: obj.arrival ?? "",
      departureTime: obj.departureTime ?? "",
      arrivalTime: obj.arrivalTime ?? "",
      totalTime: obj.totalTime ?? 0,

      // Optional fields (only include if present in source object)
      ...(obj.picTime !== undefined && { picTime: obj.picTime }),
      ...(obj.dualReceived !== undefined && { dualReceived: obj.dualReceived }),
      ...(obj.soloTime !== undefined && { soloTime: obj.soloTime }),
      ...(obj.nightTime !== undefined && { nightTime: obj.nightTime }),
      ...(obj.ifrActual !== undefined && { ifrActual: obj.ifrActual }),
      ...(obj.ifrSimulated !== undefined && { ifrSimulated: obj.ifrSimulated }),
      ...(obj.crossCountry !== undefined && { crossCountry: obj.crossCountry }),

      ...(obj.dayLandings !== undefined && { dayLandings: obj.dayLandings }),
      ...(obj.nightLandings !== undefined && { nightLandings: obj.nightLandings }),

      ...(obj.multiEngine !== undefined && { multiEngine: obj.multiEngine }),
      ...(obj.variablePitch !== undefined && { variablePitch: obj.variablePitch }),
      ...(obj.retractableGear !== undefined && { retractableGear: obj.retractableGear }),
      ...(obj.tailwheel !== undefined && { tailwheel: obj.tailwheel }),

      ...(obj.approaches !== undefined && { approaches: obj.approaches }),
      ...(obj.approachTypes !== undefined && { approachTypes: obj.approachTypes }),

      ...(obj.isSimulator !== undefined && { isSimulator: obj.isSimulator }),
      ...(obj.simulatorType !== undefined && { simulatorType: obj.simulatorType }),

      ...(obj.instructor !== undefined && { instructor: obj.instructor }),
      ...(obj.checkRide !== undefined && { checkRide: obj.checkRide }),

      ...(obj.carrierTraps !== undefined && { carrierTraps: obj.carrierTraps }),
      ...(obj.airToAirKills !== undefined && { airToAirKills: obj.airToAirKills }),
      ...(obj.aerialRefueling !== undefined && { aerialRefueling: obj.aerialRefueling }),

      ...(obj.remarks !== undefined && { remarks: obj.remarks })
    };
  }
}
