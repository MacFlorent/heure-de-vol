export interface FormField {
  name: string;
  label: string;
  value: string | boolean;
  type: string;
  error: string | null;
  touched: boolean;
}

export interface FormState {
  fields: Record<string, FormField>;
  isSubmitting: boolean;
}

export enum FormActionType {
  FieldChange = "FIELD_CHANGE",
  FieldBlur = "FIELD_BLUR",
  FormSubmit = "FORM_SUBMIT",
  FormSubmitSuccess = "SUBMIT_SUCCESS",
  FormSubmitError = "SUBMIT_ERROR",
  FormReset = "RESET_FORM",
}

export type FormAction =
  | { type: FormActionType.FieldChange; payload: { field: string; value: string | boolean } }
  | { type: FormActionType.FieldBlur; payload: { field: string } }
  | { type: FormActionType.FormSubmit }
  | { type: FormActionType.FormSubmitSuccess }
  | { type: FormActionType.FormSubmitError; payload: { field: string; error: string } }
  | { type: FormActionType.FormReset };
