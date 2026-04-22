import { useReducer, useCallback } from "react";
import { produce } from "immer";
import { FormState, FormAction, FormActionType, FormFieldStateFactory, FormFieldStateValue } from "@/types/form-state";
import { FormFieldType } from "@/types/form-field";
import { Button, FormField } from "@/components/ui";
import ActiveLogbookPanel from "@/components/ActiveLogbookPanel";
import { useActiveLogbook } from "@/components/contexts/ActiveLogbookContext";
import { Flight, FlightFactory } from "@/types/flight";
import { useAddFlight, useUpdateFlight, useDeleteFlight } from "../queries";

// ============================================================================
// LogbookFormProps
interface FlightFormProps {
  flight: Flight | null;
  onClose: () => void;
}

// ============================================================================
// Initial State
const initialState = (data: Flight | null): FormState => {
  const d = data ?? FlightFactory.empty(null);

  return {
    fieldStates: {
      date: FormFieldStateFactory.create("date", d.date),
      aircraftTypeId: FormFieldStateFactory.create("aircraftTypeId", d.aircraftTypeId),
      registration: FormFieldStateFactory.create("registration", d.aircraftRegistration),
      description: FormFieldStateFactory.create("description", d.description),
      timeTotal: FormFieldStateFactory.create("timeTotal", d.timeTotal),
      timePic: FormFieldStateFactory.create("timePic", d.timePic),
      timeDualInstructed: FormFieldStateFactory.create("timeDualInstructed", d.timeDualInstructed),
      timeDualReceived: FormFieldStateFactory.create("timeDualReceived", d.timeDualReceived),
      timeSoloSupervised: FormFieldStateFactory.create("timeSoloSupervised", d.timeSoloSupervised),
      timeNight: FormFieldStateFactory.create("timeNight", d.timeNight),
      timeCrossCountry: FormFieldStateFactory.create("timeCrossCountry", d.timeCrossCountry),
      timeIfrSimulated: FormFieldStateFactory.create("timeIfrSimulated", d.timeIfrActual),
      timeIfrActual: FormFieldStateFactory.create("timeIfrActual", d.timeIfrActual),
      timeAerobatics: FormFieldStateFactory.create("timeCustom1", d.timeCustom1),
      timeCustom1: FormFieldStateFactory.create("timeCustom2", d.timeCustom2),
      landingsDay: FormFieldStateFactory.create("landingsDay", d.landingsDay),
      landingsNight: FormFieldStateFactory.create("landingsNight", d.landingsNight),
      counterCustom1: FormFieldStateFactory.create("counterCustom1", d.counterCustom1),
      counterCustom2: FormFieldStateFactory.create("counterCustom2", d.counterCustom2),
      remarks: FormFieldStateFactory.create("remarks", d.remarks),
    },
    isSubmitting: false,
    submitError: "",
  };
};

// ============================================================================
// State to Data
const fieldsToData = (fieldStates: FormState["fieldStates"], existingData: Flight | null, logbookId: string | null): Flight => {
  const d = existingData ?? FlightFactory.empty(logbookId);

  return {
    id: d.id,
    logbookId: d.logbookId,
    date: fieldStates.date.value as Date | null,
    aircraftTypeId: fieldStates.aircraftTypeId.value as string,
    aircraftRegistration: fieldStates.registration.value as string,
    description: fieldStates.description.value as string,
    timeTotal: fieldStates.timeTotal.value as number,
    timePic: fieldStates.timePic.value as number,
    timeDualInstructed: fieldStates.timeDualInstructed.value as number,
    timeDualReceived: fieldStates.timeDualReceived.value as number,
    timeSoloSupervised: fieldStates.timeSoloSupervised.value as number,
    timeNight: fieldStates.timeNight.value as number,
    timeCrossCountry: fieldStates.timeCrossCountry.value as number,
    timeIfrSimulated: fieldStates.timeIfrSimulated.value as number,
    timeIfrActual: fieldStates.timeIfrActual.value as number,
    timeCustom1: fieldStates.timeCustom1.value as number,
    timeCustom2: fieldStates.timeCustom2.value as number,
    landingsDay: fieldStates.landingsDay.value as number,
    landingsNight: fieldStates.landingsNight.value as number,
    counterCustom1: fieldStates.counterCustom1.value as number,
    counterCustom2: fieldStates.counterCustom2.value as number,
    remarks: fieldStates.remarks.value as string,
  };
};

// ============================================================================
// Form Sate Reducer
const validateField = (field: string, value: string | boolean | number | Date | null): string => {
  if (typeof value !== "string") return "";

  const trimmedValue = value.trim();

  switch (field) {
    case "aircraftTypeId":
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
      draft.submitError = "";
      break;
    }

    case FormActionType.FormSubmitSuccess: {
      draft.isSubmitting = false;
      break;
    }

    case FormActionType.FormSubmitError: {
      const { field, error } = action.payload;
      draft.isSubmitting = false;
      if (field === "general") {
        draft.submitError = error;
      } else if (draft.fieldStates[field]) {
        draft.fieldStates[field].error = error;
        draft.fieldStates[field].touched = true;
      }
      break;
    }
  }
});

// ============================================================================
// FlightForm
export default function FlightForm({ flight, onClose }: FlightFormProps) {
  const [state, dispatch] = useReducer(formReducer, flight, initialState);
  const { activeLogbook } = useActiveLogbook();
  const isEditMode = flight !== null;
  const addFlight = useAddFlight();
  const updateFlight = useUpdateFlight();
  const deleteFlight = useDeleteFlight();

  // Events
  const handleChange = useCallback((name: string, value: FormFieldStateValue) => {
    dispatch({
      type: FormActionType.FieldChange,
      payload: { field: name, value },
    });
  }, []);

  const handleBlur = useCallback((name: string) => {
    dispatch({
      type: FormActionType.FieldBlur,
      payload: { field: name },
    });
  }, []);

  const handleDelete = useCallback(async () => {
    if (!flight?.id) return;
    if (!window.confirm("The flight will be deleted. Continue?")) return;

    dispatch({ type: FormActionType.FormSubmit });
    try {
      await deleteFlight.mutateAsync(flight.id);
      dispatch({ type: FormActionType.FormSubmitSuccess });
      onClose();
    } catch (error) {
      console.error("Failed to delete flight:", error);
      dispatch({ type: FormActionType.FormSubmitError, payload: { field: "general", error: "Failed to delete flight" } });
    }
  }, [flight, deleteFlight, onClose]);

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
      const f = fieldsToData(state.fieldStates, flight, activeLogbook.id);
      if (isEditMode) {
        await updateFlight.mutateAsync(f);
      } else {
        await addFlight.mutateAsync(f);
      }
      dispatch({ type: FormActionType.FormSubmitSuccess });
      onClose();
    } catch (error) {
      console.error("Failed to save flight:", error);
      dispatch({ type: FormActionType.FormSubmitError, payload: { field: "general", error: "Failed to save flight" } });
    }
  }, [state.fieldStates, flight, isEditMode, addFlight, updateFlight, onClose, activeLogbook]);

  // Component Render
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{isEditMode ? "Edit Flight" : "New Flight"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ActiveLogbookPanel />

        <FormField label="Date" formFieldType={FormFieldType.Date} formFieldState={state.fieldStates.date} onChange={handleChange} onBlur={handleBlur} />
        <FormField label="Aircraft Type" formFieldType={FormFieldType.Text} formFieldState={state.fieldStates.aircraftTypeId} onChange={handleChange} onBlur={handleBlur} />
        <FormField label="Registration" formFieldType={FormFieldType.Text} formFieldState={state.fieldStates.registration} onChange={handleChange} onBlur={handleBlur} />
        <FormField label="Total Time" formFieldType={FormFieldType.Decimal} formFieldState={state.fieldStates.timeTotal} onChange={handleChange} onBlur={handleBlur} />
        <FormField label="Landings (Day)" formFieldType={FormFieldType.Integer} formFieldState={state.fieldStates.landingsDay} onChange={handleChange} onBlur={handleBlur} />
        {activeLogbook?.flightFields.timeNight && (
          <FormField label="Night" formFieldType={FormFieldType.Decimal} formFieldState={state.fieldStates.timeNight} onChange={handleChange} onBlur={handleBlur} />
        )}
        {activeLogbook?.flightFields.timeNight && (
          <FormField label="Landings (Night)" formFieldType={FormFieldType.Integer} formFieldState={state.fieldStates.landingsNight} onChange={handleChange} onBlur={handleBlur} />
        )}
        {activeLogbook?.flightFields.timeDualInstructed && (
          <FormField label="Dual Instructed" formFieldType={FormFieldType.Decimal} formFieldState={state.fieldStates.timeDualInstructed} onChange={handleChange} onBlur={handleBlur} />
        )}
        {activeLogbook?.flightFields.timeDualReceived && (
          <FormField label="Dual Received" formFieldType={FormFieldType.Decimal} formFieldState={state.fieldStates.timeDualReceived} onChange={handleChange} onBlur={handleBlur} />
        )}
        {activeLogbook?.flightFields.timeSoloSupervised && (
          <FormField label="Solo Supervised" formFieldType={FormFieldType.Decimal} formFieldState={state.fieldStates.timeSoloSupervised} onChange={handleChange} onBlur={handleBlur} />
        )}
        {activeLogbook?.flightFields.timeIfrSimulated && (
          <FormField label="IFR Simulated" formFieldType={FormFieldType.Decimal} formFieldState={state.fieldStates.timeIfrSimulated} onChange={handleChange} onBlur={handleBlur} />
        )}
        {activeLogbook?.flightFields.timeIfrActual && (
          <FormField label="IFR Actual" formFieldType={FormFieldType.Decimal} formFieldState={state.fieldStates.timeIfrActual} onChange={handleChange} onBlur={handleBlur} />
        )}

        {activeLogbook?.flightFields.timeCustom1 && (
          <FormField label={activeLogbook.flightFieldsCustom.timeCustom1} formFieldType={FormFieldType.Decimal} formFieldState={state.fieldStates.timeCustom1} onChange={handleChange} onBlur={handleBlur} />
        )}
        {activeLogbook?.flightFields.timeCustom2 && (
          <FormField label={activeLogbook.flightFieldsCustom.timeCustom2} formFieldType={FormFieldType.Decimal} formFieldState={state.fieldStates.timeCustom2} onChange={handleChange} onBlur={handleBlur} />
        )}
        {activeLogbook?.flightFields.counterCustom1 && (
          <FormField label={activeLogbook.flightFieldsCustom.counterCustom1} formFieldType={FormFieldType.Integer} formFieldState={state.fieldStates.counterCustom1} onChange={handleChange} onBlur={handleBlur} />
        )}
        {activeLogbook?.flightFields.counterCustom2 && (
          <FormField label={activeLogbook.flightFieldsCustom.counterCustom2} formFieldType={FormFieldType.Integer} formFieldState={state.fieldStates.counterCustom2} onChange={handleChange} onBlur={handleBlur} />
        )}        
        
        <FormField label="Remarks" formFieldType={FormFieldType.Text} formFieldState={state.fieldStates.remarks} onChange={handleChange} onBlur={handleBlur} />

        {state.submitError && (
          <p className="text-danger-500 text-sm">{state.submitError}</p>
        )}

        <div className="flex justify-between pt-2">
          <div>
            {isEditMode && (
              <Button type="button" variant="danger" disabled={state.isSubmitting} onClick={handleDelete}>
                {state.isSubmitting ? "..." : "Delete"}
              </Button>
            )}
          </div>
          <div className="flex space-x-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={state.isSubmitting}>
              {state.isSubmitting ? "..." : "Save"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
