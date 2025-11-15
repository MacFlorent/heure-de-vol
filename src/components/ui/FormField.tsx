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
   const stringToNumber = (value: string, maximumFractionDigits: number): number => {
    const valueString = value.trim().replace(/,/g, ".").replace(/[^0-9.]/g, "");
    let valueNumber = parseFloat(valueString);

    if (!isNaN(valueNumber)) {
      const multiplier = Math.pow(10, maximumFractionDigits);
      valueNumber = Math.round(valueNumber * multiplier) / multiplier;
    }
    
    return valueNumber;
  }

   const numberToString = (value: number, maximumFractionDigits: number): string => {
    let valueString = "";
    if (!isNaN(value)) {
      const formatter = new Intl.NumberFormat(navigator.language, {
        minimumFractionDigits: 0,
        maximumFractionDigits: maximumFractionDigits,
        useGrouping: false,
      });

      valueString = formatter.format(value);
    }

    return valueString;
   }
  
  const triggerOnChange = (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    const mockChangeEvent = {
      target: e.target,
      currentTarget: e.currentTarget,
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(mockChangeEvent);
  }

  const handleBlurNumber = (e: React.FocusEvent<HTMLInputElement>, maximumFractionDigits: number) => {
    const valueNumber = stringToNumber(e.target.value, maximumFractionDigits);
    e.currentTarget.value = numberToString(valueNumber, maximumFractionDigits);
    triggerOnChange(e);
    onBlur(e);
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

      console.log("handleKeyDownNumber:", valueNumber);
      if (e.key === "+") {
        valueNumber = valueNumber + increment;
      } else {
        valueNumber = Math.max(0, valueNumber - increment);
      }

      e.currentTarget.value = numberToString(valueNumber, maximumFractionDigits);;
      triggerOnChange(e)
    }
  };
  const handleKeyDownInteger = (e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDownNumber(e, 0);
  const handleKeyDownDecimal = (e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDownNumber(e, 2);

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
          name={formFieldState.name}
          value={formFieldState.value === null ? "" : String(formFieldState.value)}
          onChange={onChange}
          onBlur={handleBlurInteger}
          onKeyDown={handleKeyDownInteger}
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
          type="text"
          inputMode="decimal"
          name={formFieldState.name}
          value={formFieldState.value === null ? "" : String(formFieldState.value)}
          onChange={onChange}
          onBlur={handleBlurDecimal}
          onKeyDown={handleKeyDownDecimal}          
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
