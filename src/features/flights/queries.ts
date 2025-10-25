import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hdvDatabase } from '@/lib/database';
import { Flight } from '@/types/flight';

export const FLIGHT_QUERY_KEYS = {
  all: ['flights'] as const,
  byAircraftType: (type: string) => ['flights', 'by-aircraft', type] as const,
};

export function useFlights() {
  return useQuery({
    queryKey: FLIGHT_QUERY_KEYS.all,
    queryFn: () => hdvDatabase.getAllFlights()
  });
}

export function useFlightsByAircraftType(aircraftType: string) {
  return useQuery({
    queryKey: FLIGHT_QUERY_KEYS.byAircraftType(aircraftType),
    queryFn: () => hdvDatabase.getFlightsByAircraftType(aircraftType),
    enabled: !!aircraftType
  });
}

export function useAddFlight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (flight: Flight) => hdvDatabase.addFlight(flight),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FLIGHT_QUERY_KEYS.all });
    }
  });
}

export function useUpdateFlight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (flight: Flight) => hdvDatabase.updateFlight(flight),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FLIGHT_QUERY_KEYS.all });
    }
  });
}

export function useDeleteFlight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => hdvDatabase.deleteFlight(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FLIGHT_QUERY_KEYS.all });
    }
  });
}
