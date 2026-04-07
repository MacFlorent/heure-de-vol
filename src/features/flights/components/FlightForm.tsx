import { useReducer, useCallback } from "react";
import { produce } from "immer";

import { FormState, FormAction, FormActionType, FormFieldStateFactory } from "@/types/form-state";
import { Button, FormField, PageContainer } from "@/components/ui";
import { useAddFlight } from "../queries";
import { Flight } from "@/types/flight";
import { useActiveLogbook } from "@/components/contexts/ActiveLogbookContext";

const initialState: FormState = {
  fieldStates: {
    date: FormFieldStateFactory.date("date", "Date"),
    aircraftType: FormFieldStateFactory.text("aircraftType", "Aircraft type"),
    registration: FormFieldStateFactory.text("registration", "Registration"),
    description: FormFieldStateFactory.text("description", "Description"),
    timeTotal: FormFieldStateFactory.decimal("timeTotal", "Total time"),
    timePic: FormFieldStateFactory.decimal("timePic", "PIC time"),
    timeDualInstructed: FormFieldStateFactory.decimal("timeDualInstructed", "Instructed time"),
    timeDualReceived: FormFieldStateFactory.decimal("timeDualReceived", "Dual received time"),
    timeSoloSupervised: FormFieldStateFactory.decimal("timeSoloSupervised", "Solo supervised time"),
    timeNight: FormFieldStateFactory.decimal("timeNight", "Night time"),
    timeCrossCountry: FormFieldStateFactory.decimal("timeCrossCountry", "Cross-country time"),
    timeIfrSimulated: FormFieldStateFactory.decimal("timeIfrSimulated", "IFR simulated time"),
    timeIfrActual: FormFieldStateFactory.decimal("timeIfrActual", "IFR actual time"),
    timeAerobatics: FormFieldStateFactory.decimal("timeAerobatics", "Aerobatics time"),
    timeCustom1: FormFieldStateFactory.decimal("timeAerobatics", "*** Logbook custom time name 1 ***"),
    timeCustom2: FormFieldStateFactory.decimal("timeAerobatics", "*** Logbook custom time name 2 ***"),
    landingsDay: FormFieldStateFactory.integer("landingsDay", "Day landings"),
    landingsNight: FormFieldStateFactory.integer("landingsNight", "Night landings"),
    counterCustom1: FormFieldStateFactory.integer("counterCustom1", "*** Logbook custom counter name 1 ***"),
    counterCustom2: FormFieldStateFactory.integer("counterCustom2", "*** Logbook custom counter name 2 ***"),
    remarks: FormFieldStateFactory.text("remarks", "Remarks"),
  },
  isSubmitting: false,
};

const validateField = (field: string, value: string | boolean | number | Date | null): string => {
  if (typeof value !== "string") return "";

  const trimmedValue = value.trim();

  switch (field) {
    case "aircraftType":
      return trimmedValue.length < 2 ? "Aircraft type must be at least 2 characters" : "";
    case "registration":
      return trimmedValue.length === 0 ? "Registration is required" : "";
    default:
      return "";
  }
};

const formReducer = produce((draft: FormState, action: FormAction) => {
  switch (action.type) {
    case FormActionType.FieldChange: {
      const { field, value } = action.payload;
      draft.fieldStates[field].value = value;
      draft.fieldStates[field].error = validateField(field, value);
      break;
    }

    case FormActionType.FieldBlur: {
      const { field } = action.payload;
      draft.fieldStates[field].touched = true;
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

export default function FlightForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { activeLogbook } = useActiveLogbook();
  const addFlight = useAddFlight();

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

    if (!activeLogbook) {
      alert("No logbook selected. Please wait for logbook to load.");
      return;
    }

    const hasErrors = Object.values(state.fieldStates).some(field => field.error !== "");
    if (hasErrors) return;

    dispatch({ type: FormActionType.FormSubmit });

    try {
      const flight = fieldsToFlight(state.fieldStates, activeLogbook.id);
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
  }, [state.fieldStates, addFlight, activeLogbook]);

  const handleReset = useCallback(() => {
    dispatch({ type: FormActionType.FormReset });
  }, []);

  return (
    <PageContainer>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`${activeLogbook ? "bg-primary-50 border-primary-200" : "bg-neutral-50 border-neutral-200"} border rounded p-3 mb-4`}>
          {activeLogbook ? (
            <>
              <p className="text-sm text-neutral-700">
                <span className="font-semibold">Logbook:</span> {activeLogbook.name}
              </p>
              <p className="text-xs text-neutral-500">
                ID: {activeLogbook.id}
              </p>
            </>
          ) : (
            <p className="text-sm text-neutral-600">
              No logbook loaded
            </p>
          )}
        </div>

        <FormField
          formFieldState={state.fieldStates.date}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <FormField
          formFieldState={state.fieldStates.aircraftType}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <FormField
          formFieldState={state.fieldStates.registration}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <FormField
          formFieldState={state.fieldStates.timeTotal}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <FormField
          formFieldState={state.fieldStates.landingsDay}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <FormField
          formFieldState={state.fieldStates.remarks}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <div className="space-x-4">
          <Button type="submit" disabled={state.isSubmitting}>
            {state.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
          <Button type="button" variant="secondary" onClick={handleReset}>Reset</Button>
        </div>
      </form>
    </PageContainer>
  );
};
