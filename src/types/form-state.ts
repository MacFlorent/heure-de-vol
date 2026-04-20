// ============================================================================
// FormFieldStateValue
export type FormFieldStateValue = string | number | Date | boolean | null;

// ============================================================================
// FormFieldState Interface
export interface FormFieldState {
  name: string;
  value: FormFieldStateValue;
  error: string | null;
  touched: boolean;
}

// ----------------------------------------------------------------------------
// FormFieldState Factory
export class FormFieldStateFactory {
  static create(name: string, value: FormFieldStateValue): FormFieldState {
    return {
      name: name,
      value: value,
      error: "",
      touched: false
    };
  }
}

// ============================================================================
// FormState Interface
export interface FormState {
  fieldStates: Record<string, FormFieldState>;
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
  | { type: FormActionType.FieldChange; payload: { field: string; value: FormFieldStateValue } }
  | { type: FormActionType.FieldBlur; payload: { field: string } }
  | { type: FormActionType.FormSubmit }
  | { type: FormActionType.FormSubmitSuccess }
  | { type: FormActionType.FormSubmitError; payload: { field: string; error: string } }
  | { type: FormActionType.FormReset };
