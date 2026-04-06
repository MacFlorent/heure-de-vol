// ============================================================================
// FormFieldStateType enum
export enum FormFieldStateType {
  Text = "text",
  Integer = "integer",
  Decimal = "decimal",
  Date = "date",
  Checkbox = "checkbox",
}

// ============================================================================
// FormFieldState Interface
export interface FormFieldState {
  name: string;
  inputType: FormFieldStateType;
  label: string;
  value: string | number | Date | boolean | null;
  error: string | null;
  touched: boolean;
}

// ----------------------------------------------------------------------------
// FormFieldState Factory
export class FormFieldStateFactory {
  static create(name: string, inputType: FormFieldStateType, label: string, defaultValue: string | boolean | number | Date | null): FormFieldState {
    return {
      name: name,
      label: label,
      value: defaultValue,
      inputType: inputType,
      error: "",
      touched: false
    };
  }

  static text(name: string, label: string, defaultValue: string = ""): FormFieldState {
    return FormFieldStateFactory.create(name, FormFieldStateType.Text, label, defaultValue);
  };

  static integer(name: string, label: string, defaultValue: number | null = null): FormFieldState {
    return FormFieldStateFactory.create(name, FormFieldStateType.Integer, label, defaultValue);
  };

  static decimal(name: string, label: string, defaultValue: number | null = null): FormFieldState {
    return FormFieldStateFactory.create(name, FormFieldStateType.Decimal, label, defaultValue);
  };

  static date(name: string, label: string, defaultValue: Date | null = null): FormFieldState {
    return FormFieldStateFactory.create(name, FormFieldStateType.Date, label, defaultValue);
  };

  static checkbox(name: string, label: string, defaultValue: boolean = false): FormFieldState {
    return FormFieldStateFactory.create(name, FormFieldStateType.Checkbox, label, defaultValue);
  };
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
  | { type: FormActionType.FieldChange; payload: { field: string; value: string | boolean | number | Date } }
  | { type: FormActionType.FieldBlur; payload: { field: string } }
  | { type: FormActionType.FormSubmit }
  | { type: FormActionType.FormSubmitSuccess }
  | { type: FormActionType.FormSubmitError; payload: { field: string; error: string } }
  | { type: FormActionType.FormReset };
