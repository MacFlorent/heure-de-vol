export const STORE_NAMES = {
  APP_SETTINGS: "appSettings",
  AIRCRAFT_TYPES: "aircraftTypes",
  LOGBOOKS: "logbooks",
  FLIGHTS: "flights"
} as const;

export type StoreName = typeof STORE_NAMES[keyof typeof STORE_NAMES];
