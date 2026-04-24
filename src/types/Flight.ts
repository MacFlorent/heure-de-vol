// ============================================================================
// Flight Interface
export interface Flight {
  id: string | null;
  logbookId: string | null;
  date: Date | null;
  aircraftTypeId: string | null;
  aircraftRegistration: string;
  description: string;
  timeTotal: number;
  timePic: number;
  timeDualInstructed: number;
  timeDualReceived: number;
  timeSoloSupervised: number;
  timeNight: number;
  timeCrossCountry: number;
  timeIfrSimulated: number;
  timeIfrActual: number;
  timeCustom1: number;
  timeCustom2: number;
  landingsDay: number;
  landingsNight: number;
  counterCustom1: number;
  counterCustom2: number;
  remarks: string;
}

// ----------------------------------------------------------------------------
// Flight Factory
export class FlightFactory {
  static empty(logbookId: string | null): Flight {
    return {
      id: crypto.randomUUID(),
      logbookId: logbookId,
      date: null,
      aircraftTypeId: null,
      aircraftRegistration: "",
      description: "",
      timeTotal: 0,
      timePic: 0,
      timeDualInstructed: 0,
      timeDualReceived: 0,
      timeSoloSupervised: 0,
      timeNight: 0,
      timeCrossCountry: 0,
      timeIfrSimulated: 0,
      timeIfrActual: 0,
      timeCustom1: 0,
      timeCustom2: 0,
      landingsDay: 0,
      landingsNight: 0,
      counterCustom1: 0,
      counterCustom2: 0,
      remarks: ""
    };
  }

  static fromObject(obj: Partial<Flight>, defaultLogbookId?: string): Flight {
    return {
      id: obj.id ?? crypto.randomUUID(),
      logbookId: obj.logbookId ?? defaultLogbookId ?? null,
      date: obj.date ?? null,
      aircraftTypeId: obj.aircraftTypeId ?? null,
      aircraftRegistration: obj.aircraftRegistration ?? "",
      description: obj.description ?? "",
      timeTotal: obj.timeTotal ?? 0,
      timePic: obj.timePic ?? 0,
      timeDualInstructed: obj.timeDualInstructed ?? 0,
      timeDualReceived: obj.timeDualReceived ?? 0,
      timeSoloSupervised: obj.timeSoloSupervised ?? 0,
      timeNight: obj.timeNight ?? 0,
      timeCrossCountry: obj.timeCrossCountry ?? 0,
      timeIfrSimulated: obj.timeIfrSimulated ?? 0,
      timeIfrActual: obj.timeIfrActual ?? 0,
      timeCustom1: obj.timeCustom1 ?? 0,
      timeCustom2: obj.timeCustom2 ?? 0,
      landingsDay: obj.landingsDay ?? 0,
      landingsNight: obj.landingsNight ?? 0,
      counterCustom1: obj.counterCustom1 ?? 0,
      counterCustom2: obj.counterCustom2 ?? 0,
      remarks: obj.remarks ?? ""
    };
  }
}
