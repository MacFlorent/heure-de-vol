import { createContext, useContext } from "react";
import { Logbook } from "@/types/logbook";

export interface ActiveLogbookContextData {
  activeLogbook: Logbook | null;
  setActiveLogbook: (logbook: Logbook | null) => void;
  isLoading: boolean;
  error: Error | null;
}

export const ActiveLogbookContext = createContext<ActiveLogbookContextData | undefined>(undefined);

export function useActiveLogbook(): ActiveLogbookContextData {
  const context = useContext(ActiveLogbookContext);
  if (context === undefined) {
    throw new Error("useActiveLogbook must be used within an ActiveLogbookProvider");
  }
  return context;
}
