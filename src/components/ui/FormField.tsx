import { memo } from "react";

import { FormFieldState, FormFieldStateType } from "@/types/form-state";

// ============================================================================
// FormFieldInternal
interface FormFieldInternalProps {
  label: string;
  error?: string | null;
  touched: boolean;
  children: React.ReactNode;
}

const FormFieldInternal = memo(({ label, error, touched, children }: FormFieldInternalProps) => (
  <div>
    <label className="block text-sm font-medium mb-1">
      {label}:
      {children}
    </label>
    {touched && error && (
      <p className="text-red-500 text-sm mt-1">{error}</p>
    )}
  </div>
));

FormFieldInternal.displayName = "FormFieldInternal";

// ============================================================================
// FormField
interface FormFieldProps {
  formFieldState: FormFieldState;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormField = memo(({ formFieldState: formFieldState, onBlur, onChange }: FormFieldProps) => {
  if (formFieldState.inputType === FormFieldStateType.Checkbox) {
    return (
      <FormFieldInternal
        label={formFieldState.label}
        error={formFieldState.error}
        touched={formFieldState.touched}
      >
        <input
          type="checkbox"
          name={formFieldState.name}
          checked={Boolean(formFieldState.value)}
          onChange={onChange}
          onBlur={onBlur}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </FormFieldInternal>
    );
  }
  else if (formFieldState.inputType === FormFieldStateType.Integer) {
    return (
      <FormFieldInternal
        label={formFieldState.label}
        error={formFieldState.error}
        touched={formFieldState.touched}
      >
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          name={formFieldState.name}
          value={formFieldState.value === null ? "" : String(formFieldState.value)}
          onChange={onChange}
          onBlur={onBlur}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </FormFieldInternal>
    );
  }
  else if (formFieldState.inputType === FormFieldStateType.Decimal) {
    return (
      <FormFieldInternal
        label={formFieldState.label}
        error={formFieldState.error}
        touched={formFieldState.touched}
      >
        <input
          type="number"
          step="0.01"
          name={formFieldState.name}
          value={formFieldState.value === null ? "" : String(formFieldState.value)}
          onChange={onChange}
          onBlur={onBlur}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </FormFieldInternal>
    );
  }
  else {
    return (
      <FormFieldInternal
        label={formFieldState.label}
        error={formFieldState.error}
        touched={formFieldState.touched}
      >
        <input
          type={formFieldState.inputType}
          name={formFieldState.name}
          value={formFieldState.value === null ? "" : String(formFieldState.value)}
          onChange={onChange}
          onBlur={onBlur}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </FormFieldInternal>
    );
  }
});

FormField.displayName = "FormField";
