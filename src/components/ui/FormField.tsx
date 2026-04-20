import { memo } from "react";
import { DECIMAL_FRACTION_DIGITS } from "@/constants";
import { FormFieldState, FormFieldStateValue } from "@/types/form-state";
import { FormFieldType } from "@/types/form-field";
import { stringToNumber, numberToString, stringToInteger, stringToDecimal, integerToString, decimalToString } from "@/utils/number";
import { dateToIsoString, IsoStringToDate } from "@/utils/date";
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
  label: string;
  formFieldType: FormFieldType;
  formFieldState: FormFieldState;
  onBlur: (name: string) => void;
  onChange: (name: string, value: FormFieldStateValue) => void;
}

export const FormField = memo(({ label, formFieldType, formFieldState, onBlur, onChange }: FormFieldProps) => {
  // Events Change
  const handleChange = (value: string | boolean) => {
    let convertedValue : FormFieldStateValue;

    if (formFieldType === FormFieldType.Integer) {
      convertedValue = stringToInteger(value as string); // as will do because we now the component will pass the expected types
    }
    else if (formFieldType === FormFieldType.Decimal) {
      convertedValue = stringToDecimal(value as string);
    }
    else if (formFieldType === FormFieldType.Date) {
      convertedValue = IsoStringToDate(value as string);
    }
    else { // Checkbox and Text
      convertedValue = value;
    }
    
    onChange(formFieldState.name, convertedValue);
  };

  // Events Blur
  const handleBlur = (value: string | boolean) => {
    if (formFieldType === FormFieldType.Integer) {
      handleBlurNumber(value as string);
    }
    else if (formFieldType === FormFieldType.Decimal) {
      handleBlurNumber(value as string);
    }
    else {
      onBlur(formFieldState.name);
    }
  };

  const handleBlurNumber = (value: string) => {
    let convertedValue: number = NaN;

    if (formFieldType === FormFieldType.Integer) {
      convertedValue = stringToInteger(value);
    }
    else if (formFieldType === FormFieldType.Decimal) {
      convertedValue = stringToDecimal(value);
    }
    
    onChange(formFieldState.name, convertedValue);
    onBlur(formFieldState.name);
  };

  // Events KeyDown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (formFieldType === FormFieldType.Integer) {
      handleKeyDownNumber(e, 0);
    }
    else if (formFieldType === FormFieldType.Decimal) {
      handleKeyDownNumber(e, DECIMAL_FRACTION_DIGITS);
    }
  };

  const handleKeyDownNumber = (e: React.KeyboardEvent<HTMLInputElement>, maximumFractionDigits: number) => {
    if (e.key === "+" || e.key === "-") {
      e.preventDefault();

      let convertedValue = stringToNumber(e.currentTarget.value, maximumFractionDigits);
      if (isNaN(convertedValue)) {
        convertedValue = 0;
      }

      const increment = e.ctrlKey ? 0.1 : 1;

      if (e.key === "+") {
        convertedValue = convertedValue + increment;
      } else {
        convertedValue = Math.max(0, convertedValue - increment);
      }

      e.currentTarget.value = numberToString(convertedValue, maximumFractionDigits);
      onChange(formFieldState.name, convertedValue);
    }
  };

  // Component Render
  if (formFieldType === FormFieldType.Checkbox) {
    return (
      <FormFieldInternal
        label={label}
        error={formFieldState.error}
        touched={formFieldState.touched}
      >
        <Checkbox
          name={formFieldState.name}
          checked={formFieldState.value as boolean | null ?? false}
          onChange={(e) => handleChange(e.target.checked)}
          onBlur={(e) => handleBlur(e.target.checked)}
        />
      </FormFieldInternal>
    );
  }
  else if (formFieldType === FormFieldType.Integer) {
    return (
      <FormFieldInternal
        label={label}
        error={formFieldState.error}
        touched={formFieldState.touched}
      >
        <Input
          type="text"
          inputMode="numeric"
          name={formFieldState.name}
          value={integerToString(formFieldState.value as number | null)}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={(e) => handleBlur(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
      </FormFieldInternal>
    );
  }
  else if (formFieldType === FormFieldType.Decimal) {
    return (
      <FormFieldInternal
        label={label}
        error={formFieldState.error}
        touched={formFieldState.touched}
      >
        <Input
          type="text"
          inputMode="decimal"
          name={formFieldState.name}
          value={decimalToString(formFieldState.value as number | null)}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={(e) => handleBlur(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
      </FormFieldInternal>
    );
  }
  else if (formFieldType === FormFieldType.Date) {
    return (
      <FormFieldInternal
        label={label}
        error={formFieldState.error}
        touched={formFieldState.touched}
      >
        <Input
          type="date"
          name={formFieldState.name}
          value={dateToIsoString(formFieldState.value as Date | null)}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={(e) => handleBlur(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
      </FormFieldInternal>
    );
  }
  else {
    return (
      <FormFieldInternal
        label={label}
        error={formFieldState.error}
        touched={formFieldState.touched}
      >
        <Input
          type="text"
          name={formFieldState.name}
          value={formFieldState.value as string | null ?? ""}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={(e) => handleBlur(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
      </FormFieldInternal>
    );
  }
});

FormField.displayName = "FormField";
