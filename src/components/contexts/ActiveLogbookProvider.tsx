import { useState, useEffect, ReactNode } from "react";
import { Logbook } from "@/types/logbook";
import { hdvDatabase } from "@/lib/database";
import { ActiveLogbookContextData, ActiveLogbookContext } from "@/components/contexts/ActiveLogbookContext";

interface ActiveLogbookProviderProps {
  children: ReactNode;
}

export function ActiveLogbookProvider({ children }: ActiveLogbookProviderProps) {
  const [activeLogbook, setActiveLogbook] = useState<Logbook | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load default logbook on mount
  useEffect(() => {
    const loadLogbook = async () => {
      try {
        await hdvDatabase.initialize();
        console.info("ActiveLogbookProvider: Database initialized");
        const logbook = await hdvDatabase.getDefaultLogbook();
        console.info("ActiveLogbookProvider: Default logbook loaded", logbook);
        if (logbook) {
          setActiveLogbook(logbook);
        }
      } catch (error) {
        console.error("Failed to load default logbook:", error);
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
  };

  return (
    <ActiveLogbookContext.Provider value={value}>
      {children}
    </ActiveLogbookContext.Provider>
  );
}