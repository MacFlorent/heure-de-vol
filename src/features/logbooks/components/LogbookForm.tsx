import { useReducer, useCallback } from "react";
import { produce } from "immer";

import { FormState, FormAction, FormActionType, FormFieldStateFactory } from "@/types/form-state";
import { FormField } from "@/components/ui/FormField";
import { Logbook, LogbookFactory } from "@/types/logbook";
import { useAddLogbook, useUpdateLogbook } from "../queries";

interface LogbookFormProps {
    logbook: Logbook | null;
    onClose: () => void;
}

const initialState = (data: Logbook | null): FormState => {
    const d = data ?? LogbookFactory.empty();
    const dff = d.flightFields;
    const dffc = d.flightFieldsCustom;

    return {
        fieldStates: {
            name: FormFieldStateFactory.text("name", "Name", d.name),
            description: FormFieldStateFactory.text("description", "Description", d.description),
            timeDualInstructed: FormFieldStateFactory.checkbox("timeDualInstructed", "Dual instructed time", dff.timeDualInstructed),
            timeDualReceived: FormFieldStateFactory.checkbox("timeDualReceived", "Dual received time", dff.timeDualReceived),
            timeSoloSupervised: FormFieldStateFactory.checkbox("timeSoloSupervised", "Solo supervised time", dff.timeSoloSupervised),
            timeNight: FormFieldStateFactory.checkbox("timeNight", "Night time", dff.timeNight),
            timeIfrSimulated: FormFieldStateFactory.checkbox("timeIfrSimulated", "IFR simulated time", dff.timeIfrSimulated),
            timeIfrActual: FormFieldStateFactory.checkbox("timeIfrActual", "IFR actual time", dff.timeIfrActual),
            timeCustom1: FormFieldStateFactory.checkbox("timeCustom1", "Custom time 1", dff.timeCustom1),
            timeCustom2: FormFieldStateFactory.checkbox("timeCustom2", "Custom time 2", dff.timeCustom2),
            counterCustom1: FormFieldStateFactory.checkbox("counterCustom1", "Custom counter 1", dff.counterCustom1),
            counterCustom2: FormFieldStateFactory.checkbox("counterCustom2", "Custom counter 2", dff.counterCustom2),
            timeCustom1Name: FormFieldStateFactory.text("timeCustom1Name", "Custom time 1 name", dffc.timeCustom1),
            timeCustom2Name: FormFieldStateFactory.text("timeCustom2Name", "Custom time 2 name", dffc.timeCustom2),
            counterCustom1Name: FormFieldStateFactory.text("counterCustom1Name", "Custom counter 1 name", dffc.counterCustom1),
            counterCustom2Name: FormFieldStateFactory.text("counterCustom2Name", "Custom counter 2 name", dffc.counterCustom2),
        },
        isSubmitting: false,
    };
};

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

const fieldsToLogbook = (fieldStates: FormState["fieldStates"], existingLogbook: Logbook | null): Logbook => {
    const base = existingLogbook ?? LogbookFactory.empty();
    return {
        id: base.id,
        created: base.created,
        name: String(fieldStates.name.value ?? ""),
        description: String(fieldStates.description.value ?? ""),
        flightFields: {
            timeDualInstructed: Boolean(fieldStates.timeDualInstructed.value),
            timeDualReceived: Boolean(fieldStates.timeDualReceived.value),
            timeSoloSupervised: Boolean(fieldStates.timeSoloSupervised.value),
            timeNight: Boolean(fieldStates.timeNight.value),
            timeIfrSimulated: Boolean(fieldStates.timeIfrSimulated.value),
            timeIfrActual: Boolean(fieldStates.timeIfrActual.value),
            timeCustom1: Boolean(fieldStates.timeCustom1.value),
            timeCustom2: Boolean(fieldStates.timeCustom2.value),
            counterCustom1: Boolean(fieldStates.counterCustom1.value),
            counterCustom2: Boolean(fieldStates.counterCustom2.value),
        },
        flightFieldsCustom: {
            timeCustom1: String(fieldStates.timeCustom1Name.value ?? ""),
            timeCustom2: String(fieldStates.timeCustom2Name.value ?? ""),
            counterCustom1: String(fieldStates.counterCustom1Name.value ?? ""),
            counterCustom2: String(fieldStates.counterCustom2Name.value ?? ""),
        },
    };
};

export default function LogbookForm({ logbook, onClose }: LogbookFormProps) {
    const [state, dispatch] = useReducer(formReducer, logbook, initialState);
    const isEditMode = logbook !== null;
    const addLogbook = useAddLogbook();
    const updateLogbook = useUpdateLogbook();

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        dispatch({
            type: FormActionType.FieldChange,
            payload: { field: name, value: type === "checkbox" ? checked : value },
        });
    }, []);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        dispatch({
            type: FormActionType.FieldBlur,
            payload: { field: e.target.name },
        });
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        const hasErrors = Object.values(state.fieldStates).some((field) => field.error !== "");
        if (hasErrors) return;

        dispatch({ type: FormActionType.FormSubmit });

        try {
            const lb = fieldsToLogbook(state.fieldStates, logbook);
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

    const fs = state.fieldStates;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">{isEditMode ? "Edit Logbook" : "New Logbook"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField formFieldState={fs.name} onChange={handleChange} onBlur={handleBlur} />
                <FormField formFieldState={fs.description} onChange={handleChange} onBlur={handleBlur} />

                <fieldset className="border border-gray-200 rounded p-4">
                    <legend className="text-sm font-medium text-gray-700 px-1">Optional flight fields</legend>

                        <FormField formFieldState={fs.timeDualInstructed} onChange={handleChange} onBlur={handleBlur} />
                        <FormField formFieldState={fs.timeDualReceived} onChange={handleChange} onBlur={handleBlur} />
                        <FormField formFieldState={fs.timeSoloSupervised} onChange={handleChange} onBlur={handleBlur} />
                        <FormField formFieldState={fs.timeNight} onChange={handleChange} onBlur={handleBlur} />
                        <FormField formFieldState={fs.timeIfrSimulated} onChange={handleChange} onBlur={handleBlur} />
                        <FormField formFieldState={fs.timeIfrActual} onChange={handleChange} onBlur={handleBlur} />
                        <FormField formFieldState={fs.timeCustom1} onChange={handleChange} onBlur={handleBlur} />
                        {Boolean(fs.timeCustom1.value) && (
                            <FormField formFieldState={fs.timeCustom1Name} onChange={handleChange} onBlur={handleBlur} />
                        )}
                        <FormField formFieldState={fs.timeCustom2} onChange={handleChange} onBlur={handleBlur} />
                        {Boolean(fs.timeCustom2.value) && (
                            <FormField formFieldState={fs.timeCustom2Name} onChange={handleChange} onBlur={handleBlur} />
                        )}
                        <FormField formFieldState={fs.counterCustom1} onChange={handleChange} onBlur={handleBlur} />
                        {Boolean(fs.counterCustom1.value) && (
                            <FormField formFieldState={fs.counterCustom1Name} onChange={handleChange} onBlur={handleBlur} />
                        )}
                        <FormField formFieldState={fs.counterCustom2} onChange={handleChange} onBlur={handleBlur} />
                        {Boolean(fs.counterCustom2.value) && (
                            <FormField formFieldState={fs.counterCustom2Name} onChange={handleChange} onBlur={handleBlur} />
                        )}

                </fieldset>

                <div className="flex justify-end space-x-4 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={state.isSubmitting}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {state.isSubmitting ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
}
