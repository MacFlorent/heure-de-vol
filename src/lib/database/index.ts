export { HdvDatabase } from "./database";
export type { HdvSchema } from "./schema";
export { SettingsRepository } from "./settings-repository";
export { AircraftTypesRepository } from "./aircraft-types-repository";
export { LogbooksRepository } from "./logbooks-repository";
export { FlightsRepository } from "./flights-repository";
export { STORE_NAMES } from "./constants";
export type { StoreName } from "./constants";

import { HdvDatabase } from "./database";

// Singleton instance for app-wide use
export const hdvDatabase = new HdvDatabase();
