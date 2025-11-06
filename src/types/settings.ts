// ============================================================================
// AppSettings Interface
export interface AppSettings {
  id?: string;
  language: string;
  units: 'decimalHours' | 'hoursMinutes';
  theme: 'light' | 'dark';
  defaultLogbookId?: string;
}

// ----------------------------------------------------------------------------
// AppSettings Factory
export class AppSettingsFactory {
  static default(): AppSettings {
    return {
      id: 'default',
      language: 'en',
      units: 'decimalHours',
      theme: 'light',
      defaultLogbookId: undefined
    };
  }

  static fromObject(obj: Partial<AppSettings>): AppSettings {
    return {
      id: 'default',
      language: obj.language ?? 'en',
      units: obj.units ?? 'decimalHours',
      theme: obj.theme ?? 'light',
      defaultLogbookId: obj.defaultLogbookId ?? undefined
    };
  }
}
