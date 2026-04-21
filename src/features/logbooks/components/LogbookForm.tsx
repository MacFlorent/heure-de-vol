import { useReducer, useCallback } from "react";
import { produce } from "immer";
import { FormState, FormAction, FormActionType, FormFieldStateFactory, FormFieldStateValue } from "@/types/form-state";
import { FormFieldType } from "@/types/form-field";
import { Button, Fieldset, FormField } from "@/components/ui";
import { Logbook, LogbookFactory } from "@/types/logbook";
import { useAddLogbook, useUpdateLogbook, useDeleteLogbookWithFlights } from "../queries";

// ============================================================================
// LogbookFormProps
interface LogbookFormProps {
  logbook: Logbook | null;
  onClose: () => void;
}

// ============================================================================
// Initial State
const initialState = (data: Logbook | null): FormState => {
  const d = data ?? LogbookFactory.empty();
  const dff = d.flightFields;
  const dffc = d.flightFieldsCustom;

  return {
    fieldStates: {
      name: FormFieldStateFactory.create("name", d.name),
      description: FormFieldStateFactory.create("description", d.description),
      timeDualInstructed: FormFieldStateFactory.create("timeDualInstructed", dff.timeDualInstructed),
      timeDualReceived: FormFieldStateFactory.create("timeDualReceived", dff.timeDualReceived),
      timeSoloSupervised: FormFieldStateFactory.create("timeSoloSupervised", dff.timeSoloSupervised),
      timeNight: FormFieldStateFactory.create("timeNight", dff.timeNight),
      timeIfrSimulated: FormFieldStateFactory.create("timeIfrSimulated", dff.timeIfrSimulated),
      timeIfrActual: FormFieldStateFactory.create("timeIfrActual", dff.timeIfrActual),
      timeCustom1: FormFieldStateFactory.create("timeCustom1", dff.timeCustom1),
      timeCustom2: FormFieldStateFactory.create("timeCustom2", dff.timeCustom2),
      counterCustom1: FormFieldStateFactory.create("counterCustom1", dff.counterCustom1),
      counterCustom2: FormFieldStateFactory.create("counterCustom2", dff.counterCustom2),
      timeCustom1Name: FormFieldStateFactory.create("timeCustom1Name", dffc.timeCustom1),
      timeCustom2Name: FormFieldStateFactory.create("timeCustom2Name", dffc.timeCustom2),
      counterCustom1Name: FormFieldStateFactory.create("counterCustom1Name", dffc.counterCustom1),
      counterCustom2Name: FormFieldStateFactory.create("counterCustom2Name", dffc.counterCustom2),
    },
    isSubmitting: false,
  };
};

// ============================================================================
// State to Data
const fieldsToData = (fieldStates: FormState["fieldStates"], existingData: Logbook | null): Logbook => {
  const d = existingData ?? LogbookFactory.empty();

  return {
    id: d.id,
    created: d.created,
    name: fieldStates.name.value as string,
    description: fieldStates.description.value as string,
    flightFields: {
      timeDualInstructed: fieldStates.timeDualInstructed.value as boolean,
      timeDualReceived: fieldStates.timeDualReceived.value as boolean,
      timeSoloSupervised: fieldStates.timeSoloSupervised.value as boolean,
      timeNight: fieldStates.timeNight.value as boolean,
      timeIfrSimulated: fieldStates.timeIfrSimulated.value as boolean,
      timeIfrActual: fieldStates.timeIfrActual.value as boolean,
      timeCustom1: fieldStates.timeCustom1.value as boolean,
      timeCustom2: fieldStates.timeCustom2.value as boolean,
      counterCustom1: fieldStates.counterCustom1.value as boolean,
      counterCustom2: fieldStates.counterCustom2.value as boolean,
    },
    flightFieldsCustom: {
      timeCustom1: fieldStates.timeCustom1Name.value as string,
      timeCustom2: fieldStates.timeCustom2Name.value as string,
      counterCustom1: fieldStates.counterCustom1Name.value as string,
      counterCustom2: fieldStates.counterCustom2Name.value as string,
    },
  };
};

// ============================================================================
// Form Sate Reducer
const validateField = (field: string, value: string | boolean | number | Date | null): string => {
  if (field === "name") {
    return String(value ?? "").trim().length === 0 ? "Name is required" : "";
  }
  return "";
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
      draft.isSubmitting = false;
      break;
    }
    case FormActionType.FormSubmitError: {
      draft.isSubmitting = false;
      break;
    }
  }
});

// ============================================================================
// LogbookForm
export default function LogbookForm({ logbook, onClose }: LogbookFormProps) {
  const [state, dispatch] = useReducer(formReducer, logbook, initialState);
  const isEditMode = logbook !== null;
  const addLogbook = useAddLogbook();
  const updateLogbook = useUpdateLogbook();
  const deleteLogbookWithFlights = useDeleteLogbookWithFlights();

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
    if (!logbook?.id) return;
    if (!window.confirm("Deleting this logbook will also delete all associated flight records. Continue?")) return;

    dispatch({ type: FormActionType.FormSubmit });
    try {
      await deleteLogbookWithFlights.mutateAsync(logbook.id);
      dispatch({ type: FormActionType.FormSubmitSuccess });
      onClose();
    } catch (error) {
      console.error("Failed to delete logbook:", error);
      dispatch({ type: FormActionType.FormSubmitError, payload: { field: "general", error: "Failed to delete logbook" } });
    }
  }, [logbook, deleteLogbookWithFlights, onClose]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const hasErrors = Object.values(state.fieldStates).some((field) => field.error !== "");
    if (hasErrors) return;

    dispatch({ type: FormActionType.FormSubmit });

    try {
      const lb = fieldsToData(state.fieldStates, logbook);
      if (isEditMode) {
        await updateLogbook.mutateAsync(lb);
      } else {
        await addLogbook.mutateAsync(lb);
      }
      dispatch({ type: FormActionType.FormSubmitSuccess });
      onClose();
    } catch (error) {
      console.error("Failed to save logbook:", error);
      dispatch({ type: FormActionType.FormSubmitError, payload: { field: "general", error: "Failed to save logbook" } });
    }
  }, [state.fieldStates, logbook, isEditMode, addLogbook, updateLogbook, onClose]);

  // Component Render
  const fs = state.fieldStates;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{isEditMode ? "Edit Logbook" : "New Logbook"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Name" formFieldType={FormFieldType.Text} formFieldState={fs.name} onChange={handleChange} onBlur={handleBlur} />
        <FormField label="Description" formFieldType={FormFieldType.Text} formFieldState={fs.description} onChange={handleChange} onBlur={handleBlur} />

        <Fieldset legend="Optional flight fields">
          <FormField label="Dual Instructed" formFieldType={FormFieldType.Checkbox} formFieldState={fs.timeDualInstructed} onChange={handleChange} onBlur={handleBlur} />
          <FormField label="Dual Received" formFieldType={FormFieldType.Checkbox} formFieldState={fs.timeDualReceived} onChange={handleChange} onBlur={handleBlur} />
          <FormField label="Solo Supervised" formFieldType={FormFieldType.Checkbox} formFieldState={fs.timeSoloSupervised} onChange={handleChange} onBlur={handleBlur} />
          <FormField label="Night" formFieldType={FormFieldType.Checkbox} formFieldState={fs.timeNight} onChange={handleChange} onBlur={handleBlur} />
          <FormField label="IFR Simulated" formFieldType={FormFieldType.Checkbox} formFieldState={fs.timeIfrSimulated} onChange={handleChange} onBlur={handleBlur} />
          <FormField label="IFR Actual" formFieldType={FormFieldType.Checkbox} formFieldState={fs.timeIfrActual} onChange={handleChange} onBlur={handleBlur} />
          <FormField label="Custom 1" formFieldType={FormFieldType.Checkbox} formFieldState={fs.timeCustom1} onChange={handleChange} onBlur={handleBlur} />
          {Boolean(fs.timeCustom1.value) && (
            <FormField label="Custom 1 Name" formFieldType={FormFieldType.Text} formFieldState={fs.timeCustom1Name} onChange={handleChange} onBlur={handleBlur} />
          )}
          <FormField label="Custom 2" formFieldType={FormFieldType.Checkbox} formFieldState={fs.timeCustom2} onChange={handleChange} onBlur={handleBlur} />
          {Boolean(fs.timeCustom2.value) && (
            <FormField label="Custom 2 Name" formFieldType={FormFieldType.Text} formFieldState={fs.timeCustom2Name} onChange={handleChange} onBlur={handleBlur} />
          )}
          <FormField label="Custom 1 Counter" formFieldType={FormFieldType.Checkbox} formFieldState={fs.counterCustom1} onChange={handleChange} onBlur={handleBlur} />
          {Boolean(fs.counterCustom1.value) && (
            <FormField label="Custom 1 Counter Name" formFieldType={FormFieldType.Text} formFieldState={fs.counterCustom1Name} onChange={handleChange} onBlur={handleBlur} />
          )}
          <FormField label="Custom 2 Counter" formFieldType={FormFieldType.Checkbox} formFieldState={fs.counterCustom2} onChange={handleChange} onBlur={handleBlur} />
          {Boolean(fs.counterCustom2.value) && (
            <FormField label="Custom 2 Counter Name" formFieldType={FormFieldType.Text} formFieldState={fs.counterCustom2Name} onChange={handleChange} onBlur={handleBlur} />
          )}
        </Fieldset>

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
}
