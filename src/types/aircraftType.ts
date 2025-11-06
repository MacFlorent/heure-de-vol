// ============================================================================
// AircraftType Interface
export interface AircraftType {
  id?: string;
  type: string;
  icao: string;
  name: string;
  vp: boolean;
  ru: boolean;
  me: boolean;
  tw: boolean;
  hp: boolean;
}

// ----------------------------------------------------------------------------
// AircraftType Factory
export class AircraftTypeFactory {
  static empty(): AircraftType {
    return {
      id: crypto.randomUUID(),
      type: "",
      icao: "",
      name: "",
      vp: false,
      ru: false,
      me: false,
      tw: false,
      hp: false,
    };
  }

  static fromObject(obj: Partial<AircraftType>): AircraftType {
    return {
      id: obj.id ?? crypto.randomUUID(),
      type: obj.type ?? "",
      icao: obj.icao ?? "",
      name: obj.name ?? "",
      vp: obj.vp ?? false,
      ru: obj.ru ?? false,
      me: obj.me ?? false,
      tw: obj.tw ?? false,
      hp: obj.hp ?? false,
    };
  }
}
