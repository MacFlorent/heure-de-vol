export interface AppSettings {
  id: 'default';            // Singleton identifier
  language?: string;        // UI language (e.g., 'en', 'fr')
  units?: 'metric' | 'imperial';
  theme?: 'light' | 'dark';
  defaultLogbookId?: string; // UUID of default logbook
}

export class AppSettingsFactory {
  static default(defaultLogbookId?: string): AppSettings {
    return {
      id: 'default',
      language: 'en',
      units: 'metric',
      theme: 'light',
      defaultLogbookId
    };
  }

  static fromObject(obj: Partial<AppSettings>): AppSettings {
    return {
      id: 'default',
      language: obj.language ?? 'en',
      units: obj.units ?? 'metric',
      theme: obj.theme ?? 'light',
      defaultLogbookId: obj.defaultLogbookId ?? undefined
    };
  }
}
