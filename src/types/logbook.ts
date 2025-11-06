// ============================================================================
// Logbook Interface
export interface Logbook {
  id?: string;
  name: string;
  description: string;
  created?: Date;
  flightFields: LogbookFlightFields; // Field visibility configuration (Phase 2)
  flightFieldsCustom: LogbookFlightFieldsCustom; // Field visibility configuration (Phase 2)
}

// ----------------------------------------------------------------------------
// Logbook Factory
export class LogbookFactory {
  static empty(): Logbook {
    return {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      created: new Date(),
      flightFields: LogbookFlightFieldsFactory.empty(),
      flightFieldsCustom: LogbookFlightFieldsCustomFactory.empty()
    };
  }

  static fromObject(obj: Partial<Logbook>): Logbook {
    return {
      id: obj.id ?? crypto.randomUUID(),
      name: obj.name ?? "",
      description: obj.description ?? "",
      created: obj.created ?? new Date(),
      flightFields: LogbookFlightFieldsFactory.fromObject(obj.flightFields ?? {}),
      flightFieldsCustom: LogbookFlightFieldsCustomFactory.fromObject(obj.flightFieldsCustom ?? {})
    };
  }
}

// ============================================================================
// LogbookFlightFields Interface
export interface LogbookFlightFields {
  timeDualInstructed: boolean;
  timeDualReceived: boolean;
  timeSoloSupervised: boolean;
  timeNight: boolean;
  timeIfrSimulated: boolean;
  timeIfrActual: boolean;
  timeCustom1: boolean;
  timeCustom2: boolean;
  counterCustom1: boolean;
  counterCustom2: boolean;
}

// ----------------------------------------------------------------------------
// LogbookFlightFields Factory
export class LogbookFlightFieldsFactory {
  static empty(): LogbookFlightFields {
    return {
      timeDualInstructed: false,
      timeDualReceived: true,
      timeSoloSupervised: true,
      timeNight: true,
      timeIfrSimulated: false,
      timeIfrActual: false,
      timeCustom1: false,
      timeCustom2: false,
      counterCustom1: false,
      counterCustom2: false,
    };
  }

  static fromObject(obj: Partial<LogbookFlightFields>): LogbookFlightFields {
    return {
      timeDualInstructed: obj.timeDualInstructed ?? false,
      timeDualReceived: obj.timeDualReceived ?? true,
      timeSoloSupervised: obj.timeSoloSupervised ?? true,
      timeNight: obj.timeNight ?? true,
      timeIfrSimulated: obj.timeIfrSimulated ?? false,
      timeIfrActual: obj.timeIfrActual ?? false,
      timeCustom1: obj.timeCustom1 ?? false,
      timeCustom2: obj.timeCustom2 ?? false,
      counterCustom1: obj.counterCustom1 ?? false,
      counterCustom2: obj.counterCustom2 ?? false,
    };
  }
}

// ============================================================================
// LogbookFlightFieldsCustom Interface
export interface LogbookFlightFieldsCustom {
  timeCustom1: string;
  timeCustom2: string;
  counterCustom1: string;
  counterCustom2: string;
}

// ----------------------------------------------------------------------------
// LogbookFlightFieldsCustom Factory
export class LogbookFlightFieldsCustomFactory {
  static empty(): LogbookFlightFieldsCustom {
    return {
      timeCustom1: "Custom time 1",
      timeCustom2: "Custom time 2",
      counterCustom1: "Custom counter 1",
      counterCustom2: "Custom counter 2",
    };
  }

  static fromObject(obj: Partial<LogbookFlightFieldsCustom>): LogbookFlightFieldsCustom {
    return {
      timeCustom1: obj.timeCustom1 ?? "Custom time 1",
      timeCustom2: obj.timeCustom2 ?? "Custom time 2",
      counterCustom1: obj.counterCustom1 ?? "Custom counter 1",
      counterCustom2: obj.counterCustom2 ?? "Custom counter 2",
    };
  }
}