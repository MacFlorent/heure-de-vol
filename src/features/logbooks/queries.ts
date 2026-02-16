import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hdvDatabase } from "@/lib/database";
import { Logbook } from "@/types/logbook";

export const LOGBOOK_QUERY_KEYS = {
  all: ["logbooks"] as const,
};

export function useLogbooks() {
  return useQuery({
    queryKey: LOGBOOK_QUERY_KEYS.all,
    queryFn: () => hdvDatabase.logbooks.getAllLogbooks()
  });
}

export function useAddLogbook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (logbook: Logbook) => hdvDatabase.logbooks.addLogbook(logbook),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOGBOOK_QUERY_KEYS.all });
    }
  });
}

export function useUpdateLogbook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (logbook: Logbook) => hdvDatabase.logbooks.updateLogbook(logbook),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOGBOOK_QUERY_KEYS.all });
    }
  });
}

export function useDeleteLogbook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hdvDatabase.logbooks.deleteLogbook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOGBOOK_QUERY_KEYS.all });
    }
  });
}
