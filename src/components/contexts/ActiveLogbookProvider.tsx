import { useState, useEffect, ReactNode } from "react";
import { Logbook } from "@/types/logbook";
import { hdvDatabase } from "@/lib/database";
import { logger } from "@/utils/logger";
import { ActiveLogbookContextData, ActiveLogbookContext } from "./ActiveLogbookContext";

interface ActiveLogbookProviderProps {
  children: ReactNode;
}

export function ActiveLogbookProvider({ children }: ActiveLogbookProviderProps) {
  const [activeLogbook, setActiveLogbook] = useState<Logbook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load default logbook on mount
  useEffect(() => {
    const loadLogbook = async () => {
      try {
        const logbook = await hdvDatabase.getDefaultLogbook();
        logger.info("Default logbook loaded", logbook);
        if (logbook) {
          setActiveLogbook(logbook);
        }
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLogbook();
  }, []);

  const value: ActiveLogbookContextData = {
    activeLogbook,
    setActiveLogbook,
    isLoading,
    error,
  };

  // Throw error during render so ErrorBoundary can catch it
  if (error) {
    throw error;
  }

  return (
    <ActiveLogbookContext.Provider value={value}>
      {children}
    </ActiveLogbookContext.Provider>
  );
}