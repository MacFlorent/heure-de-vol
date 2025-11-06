// ============================================================================
// FormField Interface
export interface FormField {
  name: string;
  label: string;
  value: string | boolean | number | Date;
  type: string;
  error: string | null;
  touched: boolean;
}

// ============================================================================
// FormState Interface
export interface FormState {
  fields: Record<string, FormField>;
  isSubmitting: boolean;
}

// ============================================================================
// FormActionType enum
export enum FormActionType {
  FieldChange = "FIELD_CHANGE",
  FieldBlur = "FIELD_BLUR",
  FormSubmit = "FORM_SUBMIT",
  FormSubmitSuccess = "SUBMIT_SUCCESS",
  FormSubmitError = "SUBMIT_ERROR",
  FormReset = "RESET_FORM",
}

// ============================================================================
// FormAction Type
export type FormAction =
  | { type: FormActionType.FieldChange; payload: { field: string; value: string | boolean | number | Date } }
  | { type: FormActionType.FieldBlur; payload: { field: string } }
  | { type: FormActionType.FormSubmit }
  | { type: FormActionType.FormSubmitSuccess }
  | { type: FormActionType.FormSubmitError; payload: { field: string; error: string } }
  | { type: FormActionType.FormReset };
