import { useReducer, useCallback } from "react";
import { produce } from "immer";
import { FormState, FormAction, FormActionType, FormFieldStateFactory } from "@/types/form-state";
import { Button, FormField, PageContainer } from "@/components/ui";
import { useActiveLogbook } from "@/components/contexts/ActiveLogbookContext";
import { Flight, FlightFactory } from "@/types/flight";
import { useAddFlight, useUpdateFlight, useDeleteFlight } from "../queries";
import { parseIsoWithDefault } from "@/utils/date";

// ============================================================================
// LogbookFormProps
interface FlightFormProps {
    flight: Flight | null;
    onClose: () => void;
}

// ============================================================================
// Initial State
const initialState = (data: Flight | null): FormState => {
  const d = data ?? FlightFactory.empty();

  return {
    fieldStates: {
      date: FormFieldStateFactory.date("date", "Date", d.date),
      aircraftType: FormFieldStateFactory.text("aircraftType", "Aircraft type", d.aircraftTypeId),
      registration: FormFieldStateFactory.text("registration", "Registration", d.aircraftTypeId),
      description: FormFieldStateFactory.text("description", "Description", d.aircraftTypeId),
      timeTotal: FormFieldStateFactory.decimal("timeTotal", "Total time", d.timeTotal),
      timePic: FormFieldStateFactory.decimal("timePic", "PIC time", d.timePic),
      timeDualInstructed: FormFieldStateFactory.decimal("timeDualInstructed", "Instructed time", d.timeDualInstructed),
      timeDualReceived: FormFieldStateFactory.decimal("timeDualReceived", "Dual received time", d.timeDualReceived),
      timeSoloSupervised: FormFieldStateFactory.decimal("timeSoloSupervised", "Solo supervised time", d.timeSoloSupervised),
      timeNight: FormFieldStateFactory.decimal("timeNight", "Night time", d.timeNight),
      timeCrossCountry: FormFieldStateFactory.decimal("timeCrossCountry", "Cross-country time", d.timeCrossCountry),
      timeIfrSimulated: FormFieldStateFactory.decimal("timeIfrSimulated", "IFR simulated time", d.timeIfrActual),
      timeIfrActual: FormFieldStateFactory.decimal("timeIfrActual", "IFR actual time", d.timeIfrActual),
      timeAerobatics: FormFieldStateFactory.decimal("timeCustom1", "Aerobatics time", d.timeCustom1),
      timeCustom1: FormFieldStateFactory.decimal("timeCustom2", "*** Logbook custom time name 1 ***", d.timeCustom2),
      landingsDay: FormFieldStateFactory.integer("landingsDay", "Day landings", d.landingsDay),
      landingsNight: FormFieldStateFactory.integer("landingsNight", "Night landings", d.landingsNight),
      counterCustom1: FormFieldStateFactory.integer("counterCustom1", "*** Logbook custom counter name 1 ***", d.counterCustom1),
      counterCustom2: FormFieldStateFactory.integer("counterCustom2", "*** Logbook custom counter name 2 ***", d.counterCustom2),
      remarks: FormFieldStateFactory.text("remarks", "Remarks", d.aircraftTypeId),
    },
    isSubmitting: false,
  };
};

// ============================================================================
// State to Data
const fieldsToData = (fieldStates: FormState["fieldStates"], existingData: Flight): Flight => {
  const d = existingData ?? FlightFactory.empty();

    return {
        id: d.id,
        logbookId: d.logbookId,
        date: parseIsoWithDefault(String(fieldStates.date.value ?? "")),
        aircraftTypeId: String(fieldStates.aircraftTypeId.value ?? ""),
        aircraftRegistration: String(fieldStates.aircraftRegistration.value ?? ""),
        description: String(fieldStates.description.value ?? ""),
        timeTotal: Number(fieldStates.timeTotal.value ?? 0),
        timePic: Number(fieldStates.timePic.value ?? 0),
        timeDualInstructed: Number(fieldStates.timeDualInstructed.value ?? 0),
        timeDualReceived: Number(fieldStates.timeDualReceived.value ?? 0),
        timeSoloSupervised: Number(fieldStates.timeSoloSupervised.value ?? 0),
        timeNight: Number(fieldStates.timeNight.value ?? 0),
        timeCrossCountry: Number(fieldStates.timeCrossCountry.value ?? 0),
        timeIfrSimulated: Number(fieldStates.timeIfrSimulated.value ?? 0),
        timeIfrActual: Number(fieldStates.timeIfrActual.value ?? 0),
        timeCustom1: Number(fieldStates.timeCustom1.value ?? 0),
        timeCustom2: Number(fieldStates.timeCustom2.value ?? 0),
        landingsDay: Number(fieldStates.landingsDay.value ?? 0),
        landingsNight: Number(fieldStates.landingsNight.value ?? 0),
        counterCustom1: Number(fieldStates.counterCustom1.value ?? 0),
        counterCustom2: Number(fieldStates.counterCustom2.value ?? 0),
        remarks: String(fieldStates.remarks.value ?? ""),
    }
};

// ============================================================================
// Form Sate Reducer
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



export default function FlightForm({ flight, onClose }: FlightFormProps) {
  const [state, dispatch] = useReducer(formReducer, flight, initialState);
  const { activeLogbook } = useActiveLogbook();
  const addFlight = useAddFlight();
  const updateFlight = useUpdateFlight();
  const deleteFlight = useDeleteFlight();

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
