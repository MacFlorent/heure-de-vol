import { useReducer, useCallback } from "react";
import { produce } from "immer";

import { FormState, FormAction, FormActionType, FormFieldStateFactory, FormFieldStateType } from "@/types/form-state";
import { FormField } from "@/components/ui/FormField";
import { Logbook, LogbookFactory } from "@/types/logbook";
import { useAddLogbook, useUpdateLogbook } from "../queries";

interface LogbookFormProps {
    logbook: Logbook | null;
    onClose: () => void;
}

const buildInitialState = (logbook: Logbook | null): FormState => {
    const lb = logbook ?? LogbookFactory.empty();
    const ff = lb.flightFields;
    const ffc = lb.flightFieldsCustom;

    return {
        fieldStates: {
            name: FormFieldStateFactory.create("name", FormFieldStateType.Text, "Name", lb.name),
            description: FormFieldStateFactory.create("description", FormFieldStateType.Text, "Description", lb.description),
            timeDualInstructed: FormFieldStateFactory.create("timeDualInstructed", FormFieldStateType.Checkbox, "Dual instructed time", ff.timeDualInstructed),
            timeDualReceived: FormFieldStateFactory.create("timeDualReceived", FormFieldStateType.Checkbox, "Dual received time", ff.timeDualReceived),
            timeSoloSupervised: FormFieldStateFactory.create("timeSoloSupervised", FormFieldStateType.Checkbox, "Solo supervised time", ff.timeSoloSupervised),
            timeNight: FormFieldStateFactory.create("timeNight", FormFieldStateType.Checkbox, "Night time", ff.timeNight),
            timeIfrSimulated: FormFieldStateFactory.create("timeIfrSimulated", FormFieldStateType.Checkbox, "IFR simulated time", ff.timeIfrSimulated),
            timeIfrActual: FormFieldStateFactory.create("timeIfrActual", FormFieldStateType.Checkbox, "IFR actual time", ff.timeIfrActual),
            timeCustom1: FormFieldStateFactory.create("timeCustom1", FormFieldStateType.Checkbox, "Custom time 1", ff.timeCustom1),
            timeCustom2: FormFieldStateFactory.create("timeCustom2", FormFieldStateType.Checkbox, "Custom time 2", ff.timeCustom2),
            counterCustom1: FormFieldStateFactory.create("counterCustom1", FormFieldStateType.Checkbox, "Custom counter 1", ff.counterCustom1),
            counterCustom2: FormFieldStateFactory.create("counterCustom2", FormFieldStateType.Checkbox, "Custom counter 2", ff.counterCustom2),
            timeCustom1Name: FormFieldStateFactory.create("timeCustom1Name", FormFieldStateType.Text, "Custom time 1 name", ffc.timeCustom1),
            timeCustom2Name: FormFieldStateFactory.create("timeCustom2Name", FormFieldStateType.Text, "Custom time 2 name", ffc.timeCustom2),
            counterCustom1Name: FormFieldStateFactory.create("counterCustom1Name", FormFieldStateType.Text, "Custom counter 1 name", ffc.counterCustom1),
            counterCustom2Name: FormFieldStateFactory.create("counterCustom2Name", FormFieldStateType.Text, "Custom counter 2 name", ffc.counterCustom2),
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
        case FormActionType.FormReset: {
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
    const [state, dispatch] = useReducer(formReducer, logbook, buildInitialState);
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
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
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
                    </div>
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
