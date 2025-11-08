import { useReducer, useCallback, useState, useEffect } from "react";
import { produce } from "immer";

import { FormState, FormAction, FormActionType } from "@/types/form";
import { Field } from "@/components/ui/Field";
import { useAddFlight } from "../queries";
import { Flight } from "@/types/flight";
import { Logbook } from "@/types/logbook";
import { hdvDatabase } from "@/lib/database";

const initialState: FormState = {
  fields: {
    aircraftType: { name: "aircraftType", label: "Aircraft type", value: "", type: "text", error: "", touched: false },
    registration: { name: "registration", label: "Registration", value: "", type: "text", error: "", touched: false },
    departure: { name: "departure", label: "Departure airfield", value: "", type: "text", error: "", touched: false },
    arrival: { name: "arrival", label: "Arrival airfield", value: "", type: "text", error: "", touched: false },
    departureTime: { name: "departureTime", label: "Departure time", value: "", type: "datetime-local", error: "", touched: false },
    arrivalTime: { name: "arrivalTime", label: "Arrival time", value: "", type: "datetime-local", error: "", touched: false },
    totalTime: { name: "totalTime", label: "Total time", value: "", type: "number", error: "", touched: false },
    pilotInCommand: { name: "pilotInCommand", label: "Pilot in command", value: true, type: "checkbox", error: "", touched: false },
    remarks: { name: "remarks", label: "Remarks", value: "", type: "text", error: "", touched: false },
  },
  isSubmitting: false,
};

const validateField = (field: string, value: string | boolean): string => {
  if (typeof value !== "string") return "";

  const trimmedValue = value.trim();

  switch (field) {
    case "aircraftType":
      return trimmedValue.length < 2 ? "Aircraft type must be at least 2 characters" : "";
    case "registration":
      return trimmedValue.length === 0 ? "Registration is required" : "";
    case "departure":
      return trimmedValue.length < 3 ? "Departure airfield required (min 3 characters)" : "";
    case "arrival":
      return trimmedValue.length < 3 ? "Arrival airfield required (min 3 characters)" : "";
    case "departureTime":
      return trimmedValue.length === 0 ? "Departure time is required" : "";
    case "arrivalTime":
      return trimmedValue.length === 0 ? "Arrival time is required" : "";
    case "totalTime":
      return trimmedValue.length === 0 ? "Total time is required" : "";
    default:
      return "";
  }
};

const formReducer = produce((draft: FormState, action: FormAction) => {
  switch (action.type) {
    case FormActionType.FieldChange: {
      const { field, value } = action.payload;
      draft.fields[field].value = value;
      draft.fields[field].error = validateField(field, value);
      break;
    }

    case FormActionType.FieldBlur: {
      const { field } = action.payload;
      draft.fields[field].touched = true;
      break;
    }

    case FormActionType.FormSubmit: {
      draft.isSubmitting = true;
      break;
    }

    case FormActionType.FormSubmitSuccess: {
      return initialState;
    }

    case FormActionType.FormSubmitError: {
      draft.isSubmitting = false;
      //draft.errors = action.payload.errors;
      break;
    }

    case FormActionType.FormReset: {
      return initialState;
    }
  }
});

// Helper function to convert form fields to Flight object
const fieldsToFlight = (fields: FormState["fields"], logbookId: string): Omit<Flight, "id"> => ({
  logbookId,
  date: new Date().toISOString().split("T")[0], // Current date as default
  aircraftType: String(fields.aircraftType.value),
  aircraftRegistration: String(fields.registration.value),
  departure: String(fields.departure.value),
  arrival: String(fields.arrival.value),
  departureTime: String(fields.departureTime.value),
  arrivalTime: String(fields.arrivalTime.value),
  totalTime: String(fields.totalTime.value),
  pilotInCommand: Boolean(fields.pilotInCommand.value),
  remarks: String(fields.remarks.value) || undefined,
});

const FlightForm = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [currentLogbook, setCurrentLogbook] = useState<Logbook | null>(null);
  const addFlight = useAddFlight();

  // Load default logbook on mount
  useEffect(() => {
    const loadLogbook = async () => {
      await hdvDatabase.initialize();
      const logbook = await hdvDatabase.getDefaultLogbook();
      if (logbook) {
        setCurrentLogbook(logbook);
      }
    };
    loadLogbook();
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({
      type: FormActionType.FieldChange,
      payload: { field: name, value },
    });
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    dispatch({
      type: FormActionType.FieldBlur,
      payload: { field: name },
    });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentLogbook) {
      alert("No logbook selected. Please wait for logbook to load.");
      return;
    }

    const hasErrors = Object.values(state.fields).some(field => field.error !== "");
    if (hasErrors) return;

    dispatch({ type: FormActionType.FormSubmit });

    try {
      const flight = fieldsToFlight(state.fields, currentLogbook.id);
      await addFlight.mutateAsync(flight);
      dispatch({ type: FormActionType.FormSubmitSuccess });
      alert("Flight saved successfully!");
    } catch (error) {
      console.error("Failed to save flight:", error);
      dispatch({
        type: FormActionType.FormSubmitError,
        payload: { field: "general", error: "Failed to save flight" },
      });
    }
  }, [state.fields, addFlight, currentLogbook]);

  const handleReset = useCallback(() => {
    dispatch({ type: FormActionType.FormReset });
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {currentLogbook && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Logbook:</span> {currentLogbook.name}
          </p>
          <p className="text-xs text-gray-500">
            ID: {currentLogbook.id}
          </p>
        </div>
      )}

      <Field
        stateField={state.fields.aircraftType}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <Field
        stateField={state.fields.registration}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <Field
        stateField={state.fields.departure}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <Field
        stateField={state.fields.arrival}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <Field
        stateField={state.fields.departureTime}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <Field
        stateField={state.fields.arrivalTime}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <Field
        stateField={state.fields.pilotInCommand}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <Field
        stateField={state.fields.remarks}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <div className="space-x-4">
        <button
          type="submit"
          disabled={state.isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {state.isSubmitting ? "Submitting..." : "Submit"}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default FlightForm;
