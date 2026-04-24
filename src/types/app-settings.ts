// ============================================================================
// AppSettings Interface
export interface AppSettings {
  id?: string;
  language: string;
  units: "decimalHours" | "hoursMinutes";
  theme: "light" | "dark";
  defaultLogbookId?: string | null;
}

// ----------------------------------------------------------------------------
// AppSettings Factory
export class AppSettingsFactory {
  static default(): AppSettings {
    return {
      id: "default",
      language: "en",
      units: "decimalHours",
      theme: "light",
      defaultLogbookId: null
    };
  }

  static fromObject(obj: Partial<AppSettings>): AppSettings {
    return {
      id: "default",
      language: obj.language ?? "en",
      units: obj.units ?? "decimalHours",
      theme: obj.theme ?? "light",
      defaultLogbookId: obj.defaultLogbookId ?? null
    };
  }
}
