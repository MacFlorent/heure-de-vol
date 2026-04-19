import { memo } from "react";
import { format, parseISO, isValid } from "date-fns";
import { FormFieldState, FormFieldStateType, FormFieldStateValue } from "@/types/form-state";
import { stringToNumber, numberToString } from "@/utils/number";
import { Checkbox } from "./Checkbox";
import { Input } from "./Input";

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
      <p className="text-danger-500 text-sm mt-1">{error}</p>
    )}
  </div>
));

FormFieldInternal.displayName = "FormFieldInternal";

// ============================================================================
// FormField
interface FormFieldProps {
  formFieldState: FormFieldState;
  onBlur: (name: string) => void;
  onChange: (name: string, value: FormFieldStateValue) => void;
}

export const FormField = memo(({ formFieldState, onBlur, onChange }: FormFieldProps) => {
  // Events Number
  const handleBlurNumber = (e: React.FocusEvent<HTMLInputElement>, maximumFractionDigits: number) => {
    const valueNumber = stringToNumber(e.target.value, maximumFractionDigits);
    e.currentTarget.value = numberToString(valueNumber, maximumFractionDigits);
    onChange(formFieldState.name, isNaN(valueNumber) ? null : valueNumber);
    onBlur(formFieldState.name);
  };
  const handleBlurInteger = (e: React.FocusEvent<HTMLInputElement>) => handleBlurNumber(e, 0);
  const handleBlurDecimal = (e: React.FocusEvent<HTMLInputElement>) => handleBlurNumber(e, 2);

  const handleKeyDownNumber = (e: React.KeyboardEvent<HTMLInputElement>, maximumFractionDigits: number) => {
    if (e.key === "+" || e.key === "-") {
      e.preventDefault();

      let valueNumber = stringToNumber(e.currentTarget.value, maximumFractionDigits);
      if (isNaN(valueNumber)) {
        valueNumber = 0;
      }

      const increment = e.ctrlKey ? 0.1 : 1;

      if (e.key === "+") {
        valueNumber = valueNumber + increment;
      } else {
        valueNumber = Math.max(0, valueNumber - increment);
      }

      e.currentTarget.value = numberToString(valueNumber, maximumFractionDigits);
      onChange(formFieldState.name, valueNumber);
    }
  };
  const handleKeyDownInteger = (e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDownNumber(e, 0);
  const handleKeyDownDecimal = (e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDownNumber(e, 2);

  // Format Number
  const numberDisplayValue = (maximumFractionDigits: number): string => {
    if (formFieldState.value === null) return "";
    if (typeof formFieldState.value === "number") return numberToString(formFieldState.value, maximumFractionDigits);
    return String(formFieldState.value);
  };

      // Component Render
  if (formFieldState.inputType === FormFieldStateType.Checkbox) {
    return (
      <FormFieldInternal
        label={formFieldState.label}
        error={formFieldState.error}
        touched={formFieldState.touched}
      >
        <Checkbox
          name={formFieldState.name}
          checked={Boolean(formFieldState.value)}
          onChange={(e) => onChange(formFieldState.name, e.target.checked)}
          onBlur={() => onBlur(formFieldState.name)}
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
        <Input
          type="text"
          inputMode="numeric"
          name={formFieldState.name}
          value={numberDisplayValue(0)}
          onChange={(e) => onChange(formFieldState.name, e.target.value)}
          onBlur={handleBlurInteger}
          onKeyDown={handleKeyDownInteger}
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
        <Input
          type="text"
          inputMode="decimal"
          name={formFieldState.name}
          value={numberDisplayValue(2)}
          onChange={(e) => onChange(formFieldState.name, e.target.value)}
          onBlur={handleBlurDecimal}
          onKeyDown={handleKeyDownDecimal}
        />
      </FormFieldInternal>
    );
  }
  else if (formFieldState.inputType === FormFieldStateType.Date) {
    const dateValue = formFieldState.value instanceof Date && isValid(formFieldState.value)
      ? format(formFieldState.value, "yyyy-MM-dd")
      : "";

    return (
      <FormFieldInternal
        label={formFieldState.label}
        error={formFieldState.error}
        touched={formFieldState.touched}
      >
        <Input
          type="date"
          name={formFieldState.name}
          value={dateValue}
          onChange={(e) => onChange(formFieldState.name, e.target.value ? parseISO(e.target.value) : null)}
          onBlur={() => onBlur(formFieldState.name)}
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
        <Input
          type={formFieldState.inputType}
          name={formFieldState.name}
          value={formFieldState.value === null ? "" : String(formFieldState.value)}
          onChange={(e) => onChange(formFieldState.name, e.target.value)}
          onBlur={() => onBlur(formFieldState.name)}
        />
      </FormFieldInternal>
    );
  }
});

FormField.displayName = "FormField";
