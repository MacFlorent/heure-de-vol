import { useActiveLogbook } from "@/components/contexts/ActiveLogbookContext";

// ============================================================================
// ActiveLogbookPanel
export default function ActiveLogbookPanel() {
  const { activeLogbook } = useActiveLogbook();

  return (
      activeLogbook ? (
          <p className="text-sm text-neutral-700">
            <span className="font-semibold">Logbook: {activeLogbook.name}</span>
            {import.meta.env.DEV && ` ID: ${activeLogbook.id}`}
          </p>
      ) : (
        <p className="text-sm text-neutral-600">
          No logbook loaded
        </p>
      )
 
  );
}