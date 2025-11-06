// ============================================================================
// Flight Interface
export interface Flight {
  id?: number;
  logbookId?: string;
  date?: Date;
  aircraftTypeId?: string;
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
  static empty(logbookId?: string): Flight {
    return {
      id: undefined,
      logbookId: logbookId,
      date: undefined,
      aircraftTypeId: undefined,
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
      id: obj.id ?? undefined,
      logbookId: obj.logbookId ?? defaultLogbookId ?? undefined,
      date: obj.date ?? undefined,
      aircraftTypeId: obj.aircraftTypeId ?? undefined,
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
